import { makePublicId } from './publicId.js';
import { customAlphabet } from 'nanoid';

const nano = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 5);

/**
 * Safely create a document with a unique publicId, with retry logic on collision
 * 
 * @param {Model} Model - Mongoose model
 * @param {Object} payload - Document data (without publicId)
 * @param {string} typeChar - Type character for publicId (S, B, O, P, etc.)
 * @param {string} nameForSlug - Name/identifier to use in slug
 * @param {number} maxAttempts - Maximum retry attempts on collision (default: 5)
 * @returns {Promise<Document>} Created document with publicId
 * 
 * @example
 * const newUser = await createWithPublicId(User, userData, 'B', userData.name);
 * const newOrder = await createWithPublicId(Order, orderData, 'O', '');
 */
export async function createWithPublicId(Model, payload, typeChar, nameForSlug = '', maxAttempts = 5) {
  // Try creating with generated publicId
  for (let i = 0; i < maxAttempts; i++) {
    const publicId = makePublicId(typeChar, nameForSlug);
    
    try {
      const doc = new Model({ ...payload, publicId });
      await doc.save();
      return doc;
    } catch (err) {
      // Check if error is due to duplicate publicId
      if (err.code === 11000 && err.keyPattern && err.keyPattern.publicId) {
        // Collision detected, retry with new publicId
        console.log(`PublicId collision detected (attempt ${i + 1}/${maxAttempts}): ${publicId}`);
        continue;
      }
      // Other error, throw immediately
      throw err;
    }
  }
  
  // Fallback: use timestamp-based publicId if collisions persist
  console.warn(`Max publicId generation attempts reached, using fallback ID`);
  const fallbackId = `FG${typeChar.toUpperCase()}-${Date.now().toString(36)}-${nano()}`;
  const doc = new Model({ ...payload, publicId: fallbackId });
  await doc.save();
  return doc;
}

/**
 * Generate and assign publicId to an existing document
 * Useful for migrations and backfilling
 * 
 * @param {Document} doc - Mongoose document instance
 * @param {string} typeChar - Type character for publicId
 * @param {string} nameForSlug - Name/identifier to use in slug
 * @returns {Promise<Document>} Updated document with publicId
 */
export async function assignPublicId(doc, typeChar, nameForSlug = '') {
  if (doc.publicId) {
    console.log(`Document ${doc._id} already has publicId: ${doc.publicId}`);
    return doc;
  }
  
  const maxAttempts = 5;
  for (let i = 0; i < maxAttempts; i++) {
    const publicId = makePublicId(typeChar, nameForSlug);
    
    try {
      doc.publicId = publicId;
      await doc.save();
      return doc;
    } catch (err) {
      if (err.code === 11000 && err.keyPattern && err.keyPattern.publicId) {
        console.log(`PublicId collision during assignment (attempt ${i + 1}/${maxAttempts}): ${publicId}`);
        continue;
      }
      throw err;
    }
  }
  
  // Fallback
  const fallbackId = `FG${typeChar.toUpperCase()}-${Date.now().toString(36)}-${nano()}`;
  doc.publicId = fallbackId;
  await doc.save();
  return doc;
}
