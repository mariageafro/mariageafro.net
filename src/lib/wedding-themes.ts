export interface WeddingTheme {
  key: string;
  label: string;
  emoji: string;
  description: string;
  hero: {
    overlay: string;
    fallbackGradient: string;
  };
  nav: {
    bg: string;
    text: string;
    textMuted: string;
    activeBar: string;
  };
  welcome: {
    bg: string;
    heading: string;
    body: string;
    accent: string;
    divider: string;
    scriptFont: string;
  };
  rsvp: {
    fallbackGradient: string;
    overlay: string;
    text: string;
    textMuted: string;
    divider: string;
  };
  addresses: {
    bg: string;
    heading: string;
    body: string;
    border: string;
    link: string;
  };
  footer: {
    bg: string;
    text: string;
    highlight: string;
  };
  moments: {
    overlay: string;
    text: string;
    textMuted: string;
    divider: string;
  };
}

export const weddingThemes: Record<string, WeddingTheme> = {
  classic: {
    key: "classic",
    label: "Classic",
    emoji: "🖤",
    description: "Élégant noir & blanc, intemporel",
    hero: {
      overlay: "bg-black/30",
      fallbackGradient: "from-[hsl(25,20%,25%)] to-[hsl(25,15%,15%)]",
    },
    nav: {
      bg: "bg-[hsl(0,0%,10%)]",
      text: "text-white",
      textMuted: "text-white/60",
      activeBar: "border-white",
    },
    welcome: {
      bg: "bg-white",
      heading: "text-[hsl(25,30%,20%)]",
      body: "text-[hsl(25,10%,45%)]",
      accent: "text-[hsl(25,20%,40%)]",
      divider: "bg-[hsl(25,15%,80%)]",
      scriptFont: "italic",
    },
    rsvp: {
      fallbackGradient: "from-[hsl(25,15%,18%)] to-[hsl(25,10%,12%)]",
      overlay: "bg-black/60",
      text: "text-white",
      textMuted: "text-white/60",
      divider: "bg-white/40",
    },
    addresses: {
      bg: "bg-white",
      heading: "text-[hsl(25,30%,20%)]",
      body: "text-[hsl(25,10%,45%)]",
      border: "border-[hsl(25,15%,85%)]",
      link: "text-[hsl(30,60%,45%)]",
    },
    footer: {
      bg: "bg-[hsl(0,0%,10%)]",
      text: "text-white/40",
      highlight: "text-white/60",
    },
    moments: {
      overlay: "bg-black/60",
      text: "text-white",
      textMuted: "text-white/80",
      divider: "bg-white/40",
    },
  },

  romantique: {
    key: "romantique",
    label: "Romantique",
    emoji: "🌸",
    description: "Tons roses doux, douceur florale",
    hero: {
      overlay: "bg-[hsl(340,30%,20%)]/40",
      fallbackGradient: "from-[hsl(340,25%,35%)] to-[hsl(350,20%,25%)]",
    },
    nav: {
      bg: "bg-[hsl(340,20%,18%)]",
      text: "text-[hsl(340,30%,90%)]",
      textMuted: "text-[hsl(340,20%,70%)]",
      activeBar: "border-[hsl(340,40%,80%)]",
    },
    welcome: {
      bg: "bg-[hsl(340,30%,97%)]",
      heading: "text-[hsl(340,25%,25%)]",
      body: "text-[hsl(340,15%,45%)]",
      accent: "text-[hsl(340,35%,55%)]",
      divider: "bg-[hsl(340,25%,85%)]",
      scriptFont: "italic",
    },
    rsvp: {
      fallbackGradient: "from-[hsl(340,25%,22%)] to-[hsl(350,20%,15%)]",
      overlay: "bg-[hsl(340,30%,15%)]/70",
      text: "text-[hsl(340,30%,95%)]",
      textMuted: "text-[hsl(340,20%,75%)]",
      divider: "bg-[hsl(340,30%,70%)]/50",
    },
    addresses: {
      bg: "bg-[hsl(340,30%,97%)]",
      heading: "text-[hsl(340,25%,25%)]",
      body: "text-[hsl(340,15%,45%)]",
      border: "border-[hsl(340,25%,88%)]",
      link: "text-[hsl(340,45%,50%)]",
    },
    footer: {
      bg: "bg-[hsl(340,20%,15%)]",
      text: "text-[hsl(340,20%,55%)]",
      highlight: "text-[hsl(340,30%,75%)]",
    },
    moments: {
      overlay: "bg-[hsl(340,30%,15%)]/70",
      text: "text-[hsl(340,30%,95%)]",
      textMuted: "text-[hsl(340,20%,80%)]",
      divider: "bg-[hsl(340,30%,70%)]/50",
    },
  },

  moderne: {
    key: "moderne",
    label: "Moderne",
    emoji: "✨",
    description: "Minimaliste, graphique et contemporain",
    hero: {
      overlay: "bg-black/50",
      fallbackGradient: "from-[hsl(0,0%,15%)] to-[hsl(0,0%,8%)]",
    },
    nav: {
      bg: "bg-[hsl(0,0%,5%)]",
      text: "text-[hsl(0,0%,95%)]",
      textMuted: "text-[hsl(0,0%,55%)]",
      activeBar: "border-[hsl(45,80%,60%)]",
    },
    welcome: {
      bg: "bg-[hsl(0,0%,98%)]",
      heading: "text-[hsl(0,0%,10%)]",
      body: "text-[hsl(0,0%,40%)]",
      accent: "text-[hsl(45,70%,45%)]",
      divider: "bg-[hsl(0,0%,85%)]",
      scriptFont: "not-italic font-light tracking-[0.2em] uppercase text-2xl md:text-3xl",
    },
    rsvp: {
      fallbackGradient: "from-[hsl(0,0%,10%)] to-[hsl(0,0%,5%)]",
      overlay: "bg-black/70",
      text: "text-white",
      textMuted: "text-[hsl(0,0%,60%)]",
      divider: "bg-[hsl(45,80%,60%)]/60",
    },
    addresses: {
      bg: "bg-[hsl(0,0%,98%)]",
      heading: "text-[hsl(0,0%,10%)]",
      body: "text-[hsl(0,0%,40%)]",
      border: "border-[hsl(0,0%,88%)]",
      link: "text-[hsl(45,70%,45%)]",
    },
    footer: {
      bg: "bg-[hsl(0,0%,5%)]",
      text: "text-[hsl(0,0%,40%)]",
      highlight: "text-[hsl(45,80%,60%)]",
    },
    moments: {
      overlay: "bg-black/75",
      text: "text-white",
      textMuted: "text-[hsl(0,0%,70%)]",
      divider: "bg-[hsl(45,80%,60%)]/50",
    },
  },

  tropical: {
    key: "tropical",
    label: "Tropical",
    emoji: "🌴",
    description: "Couleurs chaudes, ambiance solaire",
    hero: {
      overlay: "bg-[hsl(160,30%,10%)]/40",
      fallbackGradient: "from-[hsl(160,35%,30%)] to-[hsl(35,40%,30%)]",
    },
    nav: {
      bg: "bg-[hsl(160,30%,12%)]",
      text: "text-[hsl(45,60%,90%)]",
      textMuted: "text-[hsl(45,30%,60%)]",
      activeBar: "border-[hsl(45,70%,65%)]",
    },
    welcome: {
      bg: "bg-[hsl(45,40%,96%)]",
      heading: "text-[hsl(160,30%,18%)]",
      body: "text-[hsl(35,20%,40%)]",
      accent: "text-[hsl(160,40%,35%)]",
      divider: "bg-[hsl(45,30%,80%)]",
      scriptFont: "italic",
    },
    rsvp: {
      fallbackGradient: "from-[hsl(160,30%,18%)] to-[hsl(160,25%,10%)]",
      overlay: "bg-[hsl(160,30%,8%)]/70",
      text: "text-[hsl(45,60%,95%)]",
      textMuted: "text-[hsl(45,30%,70%)]",
      divider: "bg-[hsl(45,50%,65%)]/50",
    },
    addresses: {
      bg: "bg-[hsl(45,40%,96%)]",
      heading: "text-[hsl(160,30%,18%)]",
      body: "text-[hsl(35,20%,40%)]",
      border: "border-[hsl(45,30%,85%)]",
      link: "text-[hsl(160,45%,35%)]",
    },
    footer: {
      bg: "bg-[hsl(160,30%,10%)]",
      text: "text-[hsl(45,20%,50%)]",
      highlight: "text-[hsl(45,60%,70%)]",
    },
    moments: {
      overlay: "bg-[hsl(160,30%,8%)]/75",
      text: "text-[hsl(45,60%,95%)]",
      textMuted: "text-[hsl(45,40%,80%)]",
      divider: "bg-[hsl(45,50%,65%)]/50",
    },
  },
};

export function getWeddingTheme(key: string | null | undefined): WeddingTheme {
  return weddingThemes[key || "classic"] || weddingThemes.classic;
}
