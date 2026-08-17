import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { ADDRESS, EMAIL, WHATSAPP_ALT, WHATSAPP_PRIMARY, WHATSAPP_UK } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-secondary/50">
      <div className="container-page py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-primary text-primary-foreground font-bold">OH</div>
            <div>
              <div className="font-display text-lg font-semibold">Oriented Hub</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Quality · Care · Solutions</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Procurement partner for institutions, hospitals, schools and individuals across Nigeria.</p>
        </div>
        <div>
          <h4 className="font-display text-base font-semibold mb-3">Shop</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/shop" className="hover:text-primary">All Products</Link></li>
            <li><Link to="/books" className="hover:text-primary">Books</Link></li>
            <li><Link to="/medical-equipment" className="hover:text-primary">Medical Equipment</Link></li>
            <li><Link to="/laboratory-equipment" className="hover:text-primary">Laboratory</Link></li>
            <li><Link to="/hospital-consumables" className="hover:text-primary">Consumables</Link></li>
            <li><Link to="/educational-materials" className="hover:text-primary">Educational Materials</Link></li>
            <li><Link to="/business-solutions" className="hover:text-primary">Business Solutions</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-base font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
            <li><Link to="/osogbo" className="hover:text-primary">Visit Us in Osogbo</Link></li>
            <li><Link to="/sales-rep" className="hover:text-primary">Become a Sales Rep</Link></li>
            
            <li><Link to="/faq" className="hover:text-primary">FAQ</Link></li>
            <li><Link to="/medical-equipment-supplier" className="hover:text-primary">Medical Equipment Supplier</Link></li>
            <li><Link to="/laboratory-equipment-supplier" className="hover:text-primary">Laboratory Equipment Supplier</Link></li>
            <li><Link to="/hospital-consumables-and-stationeries" className="hover:text-primary">Hospital Consumables and Stationeries</Link></li>
            <li><Link to="/medical-textbooks-supplier" className="hover:text-primary">Medical Textbooks Supplier</Link></li>
            <li><Link to="/nuc-accreditation-textbooks-supplier" className="hover:text-primary">NUC Accreditation Textbooks Supplier</Link></li>
            <li><Link to="/international-book-seller" className="hover:text-primary">International Book Seller</Link></li>
            <li><Link to="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-primary">Terms & Conditions</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-base font-semibold mb-3">Reach us</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2"><Phone className="h-4 w-4 mt-0.5 text-primary" /><div><div>+{WHATSAPP_PRIMARY}</div><div className="text-xs">Alt: +{WHATSAPP_ALT}</div><div className="text-xs">UK: +{WHATSAPP_UK}</div></div></li>
            <li className="flex gap-2"><Mail className="h-4 w-4 mt-0.5 text-primary" /><a href={`mailto:${EMAIL}`} className="hover:text-primary">{EMAIL}</a></li>
            <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 text-primary" /><span>{ADDRESS}</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Oriented Hub. All rights reserved.</div>
          <div>Quality Products. Better Care. Total Solutions.</div>
          <div>Worldwide Shipping Available | The Oriented Hub</div>
        </div>
      </div>
    </footer>
  );
}
