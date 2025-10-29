import React from "react";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer role="contentinfo" className="border-t bg-card py-8">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <p>
          &copy; {year} AgriLink Lanka. Connecting farmers with buyers across Sri Lanka.
        </p>
      </div>
    </footer>
  );
};
export default Footer;