import slugify from 'slugify';
import { customAlphabet } from 'nanoid';

const nano = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 5);

/**
 * Generate a human-readable public ID with format: FG<Type>-<slug>-<suffix>
 * 
 * @param {string} typeChar - Single character type code (S=Seller, B=Buyer, O=Order, P=Product, etc.)
 * @param {string} name - Name or identifier to slugify (optional)
 * @param {string} prefix - Prefix for all IDs (default: 'FG')
 * @returns {string} Public ID like 'FGS-rahul-k4t9p'
 * 
 * Examples:
 * - makePublicId('S', 'Rahul Kumar') => 'FGS-rahul-kumar-k4t9p'
 * - makePublicId('B', 'Jane Doe') => 'FGB-jane-doe-x1b7z'
 * - makePublicId('O') => 'FGO-2026-01-26-9q3rv'
 * - makePublicId('P', 'Fresh Tomatoes') => 'FGP-fresh-tomatoes-7g2kq'
 */
export function makePublicId(typeChar, name = '', prefix = 'FG') {
  const t = String(typeChar).toUpperCase();
  
  // For orders, use date if no name provided; otherwise use 'item'
  let raw;
  if (!name || name.trim() === '') {
    raw = typeChar === 'O' ? new Date().toISOString().slice(0, 10) : 'item';
  } else {
    raw = name.trim();
  }
  
  const slug = slugify(raw, { lower: true, strict: true }).slice(0, 30) || 'item';
  const suffix = nano();
  
  return `${prefix}${t}-${slug}-${suffix}`;
}

/**
 * Type codes for different models:
 * - S: Seller (User with role=seller)
 * - B: Buyer (User with role=buyer)
 * - A: Agent (User with role=agent)
 * - M: Admin (User with role=admin)
 * - O: Order
 * - P: Product
 * - C: Category
 * - N: Negotiation
 * - T: Cart
 * - X: Notification
 * - R: SellerApprovalRequest
 * - L: AdminActionLog
 */
