import { Facebook, Instagram, Linkedin, MessageCircle } from "lucide-react";

export function FloatingSocials() {
  const socials = [
    {
      name: "Facebook",
      icon: Facebook,
      href: "https://www.facebook.com/jpcannassociateslimited",
      color: "bg-[#1877F2]",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "https://www.linkedin.com/company/jpcann-associates-ltd",
      color: "bg-[#0A66C2]",
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      href: "https://wa.me/c/233241121761",
      color: "bg-[#25D366]",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://www.instagram.com/jpcannassociatesltd/",
      color: "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]",
    },
  ];

  return (
    <div className="fixed right-4 top-1/2 z-50 flex -translate-y-1/2 flex-col gap-3">
      {socials.map((social, idx) => {
        const Icon = social.icon;
        return (
          <div
            key={social.name}
            className="float-gentle"
            style={{ animationDelay: `${idx * 0.15}s` }}
          >
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              title={social.name}
              data-magnetic="true"
              className={`group flex h-11 w-11 items-center justify-center rounded-full text-white shadow-md transition-all ${social.color}`}
            >
              <Icon
                size={20}
                className="transition-transform group-hover:rotate-12 group-hover:scale-110"
              />
              <span className="sr-only">{social.name}</span>
            </a>
          </div>
        );
      })}
    </div>
  );
}
