/**
 * AI NPC System for Dynamic Interactions
 * Provides dialogue generation, decision-making, and adaptive behaviors
 */

export interface NPCPersonality {
  name: string;
  type: 'friendly' | 'hostile' | 'merchant' | 'wise' | 'mysterious';
  traits: string[];
  knowledge: string[];
}

export interface DialogueContext {
  playerLevel: number;
  playerInventory: string[];
  previousInteractions: number;
  currentLocation: string;
}

export interface NPCDialogue {
  text: string;
  options: DialogueOption[];
  emotion: 'happy' | 'angry' | 'neutral' | 'sad' | 'excited';
}

export interface DialogueOption {
  text: string;
  action: 'continue' | 'trade' | 'fight' | 'quest' | 'leave';
  consequence?: string;
}

export class AINPC {
  private personality: NPCPersonality;
  private dialogueHistory: string[] = [];
  private relationshipLevel: number = 50; // 0-100 scale

  constructor(personality: NPCPersonality) {
    this.personality = personality;
  }

  /**
   * Generate dynamic dialogue based on context and personality
   */
  generateDialogue(context: DialogueContext): NPCDialogue {
    const baseDialogues = this.getBaseDialogues(context);
    const personalizedDialogue = this.personalizeDialogue(baseDialogues, context);
    
    return {
      text: personalizedDialogue.text,
      options: this.generateDialogueOptions(context),
      emotion: this.determineEmotion(context)
    };
  }

  /**
   * Make decisions based on current context and personality
   */
  makeDecision(situation: string, context: DialogueContext): string {
    const decisions = {
      'combat': this.decideCombatAction(context),
      'trade': this.decideTradeAction(context),
      'help': this.decideHelpAction(context),
      'quest': this.decideQuestAction(context)
    };

    return decisions[situation as keyof typeof decisions] || 'continue';
  }

  /**
   * Adapt behavior based on player interactions
   */
  adaptBehavior(playerAction: string, outcome: string): void {
    switch (playerAction) {
      case 'help':
        this.relationshipLevel += 10;
        break;
      case 'attack':
        this.relationshipLevel -= 20;
        break;
      case 'trade':
        this.relationshipLevel += 5;
        break;
      case 'ignore':
        this.relationshipLevel -= 5;
        break;
    }

    this.relationshipLevel = Math.max(0, Math.min(100, this.relationshipLevel));
    this.dialogueHistory.push(`${playerAction}: ${outcome}`);
  }

  private getBaseDialogues(context: DialogueContext): { text: string } {
    const dialogues = {
      friendly: [
        "Hello there, traveler! How can I help you today?",
        "Welcome to our peaceful village! What brings you here?",
        "It's always nice to see a friendly face around these parts!"
      ],
      hostile: [
        "What do you want? Make it quick!",
        "You don't belong here, stranger.",
        "I don't trust outsiders like you."
      ],
      merchant: [
        "Welcome to my shop! I have the finest goods in the realm!",
        "Looking for something special? I might have what you need.",
        "Gold speaks louder than words, friend. What are you buying?"
      ],
      wise: [
        "Ah, a seeker of knowledge. What wisdom do you seek?",
        "The paths of destiny are many, young one. Choose wisely.",
        "I have seen much in my years. Perhaps my experience can guide you."
      ],
      mysterious: [
        "The shadows whisper your name, traveler...",
        "Not all is as it seems in this realm.",
        "Some secrets are worth more than gold, if you know where to look."
      ]
    };

    const typeDialogues = dialogues[this.personality.type];
    const selectedDialogue = typeDialogues[Math.floor(Math.random() * typeDialogues.length)];
    
    return { text: selectedDialogue };
  }

  private personalizeDialogue(base: { text: string }, context: DialogueContext): { text: string } {
    let personalizedText = base.text;

    // Modify based on relationship level
    if (this.relationshipLevel > 80) {
      personalizedText = personalizedText.replace(/traveler|stranger/gi, "dear friend");
    } else if (this.relationshipLevel < 30) {
      personalizedText = personalizedText.replace(/friend/gi, "stranger");
    }

    // Add context-specific modifications
    if (context.previousInteractions > 5) {
      personalizedText = "Good to see you again! " + personalizedText;
    }

    return { text: personalizedText };
  }

  private generateDialogueOptions(context: DialogueContext): DialogueOption[] {
    const baseOptions: DialogueOption[] = [
      { text: "Tell me about this place", action: "continue" },
      { text: "Goodbye", action: "leave" }
    ];

    // Add personality-specific options
    switch (this.personality.type) {
      case 'merchant':
        baseOptions.unshift({ text: "What do you have for sale?", action: "trade" });
        break;
      case 'hostile':
        baseOptions.unshift({ text: "I'm looking for trouble", action: "fight" });
        break;
      case 'wise':
        baseOptions.unshift({ text: "I seek your wisdom", action: "continue" });
        break;
      case 'mysterious':
        baseOptions.unshift({ text: "What secrets do you know?", action: "continue" });
        break;
    }

    // Add context-specific options
    if (context.playerLevel > 5) {
      baseOptions.push({ text: "I have a quest for you", action: "quest" });
    }

    return baseOptions;
  }

  private determineEmotion(context: DialogueContext): 'happy' | 'angry' | 'neutral' | 'sad' | 'excited' {
    if (this.relationshipLevel > 70) return 'happy';
    if (this.relationshipLevel < 30) return 'angry';
    if (this.personality.type === 'mysterious') return 'neutral';
    return 'neutral';
  }

  private decideCombatAction(context: DialogueContext): string {
    if (this.personality.type === 'hostile') return 'attack';
    if (this.relationshipLevel < 20) return 'defend';
    return 'flee';
  }

  private decideTradeAction(context: DialogueContext): string {
    if (this.personality.type === 'merchant') return 'eager';
    if (this.relationshipLevel > 60) return 'friendly';
    return 'cautious';
  }

  private decideHelpAction(context: DialogueContext): string {
    if (this.personality.type === 'friendly') return 'helpful';
    if (this.relationshipLevel > 50) return 'willing';
    return 'reluctant';
  }

  private decideQuestAction(context: DialogueContext): string {
    if (this.personality.type === 'wise') return 'important_quest';
    if (context.playerLevel > 3) return 'suitable_quest';
    return 'simple_task';
  }

  // Getters
  get name(): string { return this.personality.name; }
  get type(): string { return this.personality.type; }
  get relationship(): number { return this.relationshipLevel; }
}

/**
 * NPC Factory for creating different types of NPCs
 */
export class NPCFactory {
  static createNPC(type: NPCPersonality['type'], name: string): AINPC {
    const personalities: Record<NPCPersonality['type'], Omit<NPCPersonality, 'name'>> = {
      friendly: {
        type: 'friendly',
        traits: ['helpful', 'cheerful', 'trusting'],
        knowledge: ['local_area', 'basic_quests', 'healing_items']
      },
      hostile: {
        type: 'hostile',
        traits: ['aggressive', 'suspicious', 'territorial'],
        knowledge: ['combat', 'weapons', 'threats']
      },
      merchant: {
        type: 'merchant',
        traits: ['greedy', 'practical', 'business-minded'],
        knowledge: ['prices', 'rare_items', 'trade_routes']
      },
      wise: {
        type: 'wise',
        traits: ['knowledgeable', 'patient', 'mystical'],
        knowledge: ['ancient_lore', 'magic', 'prophecies']
      },
      mysterious: {
        type: 'mysterious',
        traits: ['secretive', 'enigmatic', 'observant'],
        knowledge: ['hidden_secrets', 'dark_magic', 'forbidden_knowledge']
      }
    };

    const personality: NPCPersonality = {
      name,
      ...personalities[type]
    };

    return new AINPC(personality);
  }
}