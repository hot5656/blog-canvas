import { BlogPost } from "@/types/blog";

const STORAGE_KEY = "blog-posts";

export const samplePosts: BlogPost[] = [
  {
    id: "1",
    title: "The Art of Mindful Living in a Digital Age",
    excerpt: "Discovering peace and presence in our hyperconnected world through intentional practices and digital boundaries.",
    content: `In an era where our attention is constantly pulled in countless directions, the practice of mindful living has become more essential than ever. The digital age, with all its conveniences and connections, has also brought a unique set of challenges to our mental well-being.

## Understanding Digital Overwhelm

We wake up to notifications, scroll through feeds during breakfast, and fall asleep with screens illuminating our faces. This constant connectivity, while offering unprecedented access to information and people, has fundamentally altered how we experience time, attention, and presence.

The average person checks their phone over 150 times a day. Each check, each notification, pulls us away from the present moment and into a reactive state of mind. We've become experts at multitasking but novices at single-tasking—the very foundation of mindful awareness.

## Cultivating Digital Boundaries

The first step toward mindful living in this context isn't to abandon technology entirely—that's neither practical nor necessary. Instead, it's about creating intentional boundaries that allow us to use technology as a tool rather than being used by it.

Consider implementing "digital sunset" practices, where screens are put away an hour before bed. Create phone-free zones in your home, perhaps the dining table or bedroom. These small boundaries can create significant shifts in how present we feel in our daily lives.

## The Power of Micro-Moments

Mindfulness doesn't require hour-long meditation sessions or silent retreats (though these can be valuable). It can be cultivated in the spaces between—waiting for coffee to brew, riding an elevator, or the few seconds before a meeting begins.

> "The present moment is filled with joy and happiness. If you are attentive, you will see it." — Thich Nhat Hanh

These micro-moments of awareness, accumulated throughout the day, can fundamentally shift our relationship with time and attention.`,
    featuredImage: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=1200&auto=format&fit=crop&q=80",
    author: {
      name: "Elena Rodriguez",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
    },
    date: "December 10, 2024",
    readTime: "6 min read",
    tags: ["Mindfulness", "Digital Wellness", "Lifestyle"]
  },
  {
    id: "2",
    title: "Architectural Marvels: Designing Spaces That Breathe",
    excerpt: "Exploring the intersection of sustainable architecture and biophilic design in modern urban landscapes.",
    content: `Architecture has always been more than shelter—it's a statement about who we are and how we relate to the world around us. In recent years, a quiet revolution has been reshaping how we think about the spaces we inhabit.

## The Biophilic Revolution

Biophilic design—the practice of incorporating natural elements into built environments—has moved from niche concept to mainstream necessity. Research consistently shows that exposure to natural elements in our daily environments reduces stress, enhances creativity, and improves overall well-being.

From living walls that purify air while providing visual calm, to strategic daylighting that aligns our circadian rhythms with natural cycles, architects are reimagining what buildings can be.

## Breathing Buildings

Some of the most innovative structures being built today function almost like living organisms. They respond to environmental conditions, regulate their own temperature, and even generate their own energy.

The Edge in Amsterdam, often cited as one of the world's most sustainable office buildings, uses 28,000 sensors to monitor temperature, lighting, humidity, and occupancy. It learns from patterns and adjusts accordingly, reducing energy consumption while increasing occupant comfort.

## The Human Scale

Perhaps the most important shift in contemporary architecture is the renewed focus on human experience. For too long, buildings were designed to impress from the outside while ignoring the people who would spend their lives within.

Today's best architects are asking different questions: How does light move through a space throughout the day? What sounds does a space create or absorb? How do materials feel under hand or foot?

These considerations, once dismissed as secondary to aesthetic or structural concerns, are now understood as fundamental to creating spaces that truly serve human flourishing.`,
    featuredImage: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1200&auto=format&fit=crop&q=80",
    author: {
      name: "Marcus Chen",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
    },
    date: "December 8, 2024",
    readTime: "8 min read",
    tags: ["Architecture", "Sustainability", "Design"]
  },
  {
    id: "3",
    title: "The Renaissance of Slow Food",
    excerpt: "How a global movement is reclaiming our relationship with food, community, and the rhythms of the earth.",
    content: `In 1986, when McDonald's opened a franchise at the Spanish Steps in Rome, journalist Carlo Petrini launched a protest that would evolve into a global movement. What began as resistance to fast food became something far more profound: a philosophy of living.

## More Than What We Eat

The Slow Food movement, now active in over 160 countries, challenges us to reconsider not just what we eat, but how we eat, where our food comes from, and the web of relationships—ecological, economic, and social—that bring sustenance to our tables.

At its core, Slow Food advocates for food that is good (quality, flavorful, and healthy), clean (produced without harming the environment), and fair (accessible prices for consumers and fair conditions for producers).

## Rediscovering Local Foodways

One of the movement's most powerful contributions has been documenting and preserving endangered foods. The "Ark of Taste" catalog has identified over 5,000 products at risk of extinction—from heritage grains to traditional cheeses to indigenous fruits.

These aren't museum pieces but living traditions that represent centuries of accumulated wisdom about how to eat well in particular places. When a food variety disappears, we lose not just a flavor but a piece of cultural heritage and biodiversity.

## The Communal Table

Perhaps most importantly, Slow Food reminds us that eating is fundamentally a social act. The communal table—where stories are shared, relationships are deepened, and cultural knowledge is passed between generations—is as essential to human flourishing as nutrients are to our bodies.

> "A meal is not just about food. It's about gathering, connecting, and taking time to be present with each other."

In our age of solo eating, meal delivery apps, and "efficient" nutrition, this reminder feels increasingly radical and necessary.`,
    featuredImage: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1200&auto=format&fit=crop&q=80",
    author: {
      name: "Isabella Fontaine",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80"
    },
    date: "December 5, 2024",
    readTime: "7 min read",
    tags: ["Food", "Culture", "Sustainability"]
  },
  {
    id: "4",
    title: "Night Sky Revival: The Fight Against Light Pollution",
    excerpt: "How communities worldwide are reclaiming the stars and reconnecting with the cosmos above.",
    content: `For most of human history, every person on Earth could look up and see a brilliant tapestry of stars. Today, 80% of the world's population lives under light-polluted skies. For one-third of humanity, the Milky Way is invisible.

## What We've Lost

The consequences extend far beyond missed astronomical wonders. Light pollution disrupts ecosystems, confusing migratory birds, disorienting sea turtle hatchlings, and throwing off the nocturnal behaviors countless species depend on.

For humans, excessive artificial light at night disrupts circadian rhythms, suppresses melatonin production, and has been linked to increased rates of obesity, depression, and certain cancers.

## The Dark Sky Movement

But change is coming. The International Dark-Sky Association has certified over 195 International Dark Sky Places—parks, reserves, and communities committed to protecting the night.

In these places, lighting ordinances require fixtures that point downward rather than up, use warm color temperatures that are less disruptive to wildlife, and illuminate only what and when necessary.

## Seeing Again

Communities that have made these changes report not just darker skies but stronger communities. Dark sky festivals draw astro-tourists. Residents rediscover the simple pleasure of evening walks under the stars.

There's something profound about looking up at the same sky our ancestors contemplated for millennia. In our light-saturated world, darkness has become something we must actively choose and protect.

The good news is that unlike many environmental problems, light pollution is immediately reversible. Turn off unnecessary lights tonight, and the stars return. It's that simple—and that revolutionary.`,
    featuredImage: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200&auto=format&fit=crop&q=80",
    author: {
      name: "David Okonkwo",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    },
    date: "December 2, 2024",
    readTime: "5 min read",
    tags: ["Environment", "Science", "Community"]
  },
  {
    id: "5",
    title: "The Quiet Power of Handwriting",
    excerpt: "In an age of keyboards and touchscreens, the ancient practice of putting pen to paper offers unexpected benefits.",
    content: `My grandmother kept journals. Dozens of them, filled with her careful script—observations about weather, recipes annotated with substitutions, the small victories and sorrows of daily life. When she passed, those journals became family treasures, her handwriting as recognizable and individual as her voice.

## The Science of Script

Neuroscience research has revealed what many intuitively sense: handwriting engages the brain differently than typing. Studies show that students who take notes by hand retain information better than those who type. The slower pace of handwriting forces a level of processing and synthesis that rapid typing bypasses.

The act of forming letters by hand activates regions of the brain involved in thinking, language, and working memory in ways that keyboard use does not. For children learning to read, the motor experience of handwriting appears to strengthen letter recognition and literacy development.

## Beyond Efficiency

Of course, for many tasks, typing is more practical. But efficiency isn't everything. There's a quality of attention in handwriting—the physical sensation of pen on paper, the visible trace of thought—that many find conducive to reflection, creativity, and presence.

Morning pages, gratitude journals, handwritten letters—these practices persist not despite but because of their "inefficiency." They slow us down, and in that slowing, something opens.

## A Personal Practice

I've returned to handwriting in recent years, keeping a small notebook for ideas that feel too fragile for screens. There's something about the commitment of ink—the inability to easily delete, the acceptance of imperfection—that encourages a different kind of thinking.

The page becomes a space for exploration rather than performance. Mistakes become features, crossed-out words and margin notes telling their own story of thought in motion.

> "The pen is the tongue of the mind." — Miguel de Cervantes`,
    featuredImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&auto=format&fit=crop&q=80",
    author: {
      name: "Sarah Mitchell",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
    },
    date: "November 28, 2024",
    readTime: "6 min read",
    tags: ["Writing", "Creativity", "Wellness"]
  }
];

export const getPosts = (): BlogPost[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(samplePosts));
  return samplePosts;
};

export const getPostById = (id: string): BlogPost | undefined => {
  const posts = getPosts();
  return posts.find(post => post.id === id);
};

export const addPost = (post: Omit<BlogPost, "id">): BlogPost => {
  const posts = getPosts();
  const newPost: BlogPost = {
    ...post,
    id: Date.now().toString()
  };
  const updatedPosts = [newPost, ...posts];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
  return newPost;
};

export const deletePost = (id: string): void => {
  const posts = getPosts();
  const updatedPosts = posts.filter(post => post.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
};

export const resetPosts = (): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(samplePosts));
};
