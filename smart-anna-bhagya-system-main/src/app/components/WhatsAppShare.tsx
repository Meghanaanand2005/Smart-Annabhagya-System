import { Share2 } from 'lucide-react';

interface WhatsAppShareProps {
  name: string;
  rationId: string;
  slotDate: string;
  shopName: string;
}

export default function WhatsAppShare({ name, rationId, slotDate, shopName }: WhatsAppShareProps) {
  const message = encodeURIComponent(
    `Hello ${name},\n\nYour ration booking is confirmed!\n\n📋 Ration ID: ${rationId}\n📅 Slot: ${slotDate}\n🏪 Shop: ${shopName}\n\nPlease show your QR code at the distribution center.\n\n- Smart Anna Bhagya`
  );

  const whatsappUrl = `https://wa.me/?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mt-4"
    >
      <Share2 className="w-4 h-4" />
      Share on WhatsApp
    </a>
  );
}

