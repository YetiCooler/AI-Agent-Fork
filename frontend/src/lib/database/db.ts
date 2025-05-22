import mongoose, { Schema } from 'mongoose';

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/edith-chatapp')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
mongoose.Promise = global.Promise;

const db = {
    User: userModel(),
    Chat: chatModel(),
    Plan: planModel(),
    AI: aiModel(),
    UsageStats: usageStateModel(),
    PlanHistory: planHistoryModel(),
    Admin: adminModel()
}

function userModel() {
    const UserSchema = new Schema({
        email: {
            type: String,
            required: true
        },
        disableModel: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'AI',
            default: []
        },
        pointsUsed: {
            type: Number,
            default: 0
        },
        pointsResetDate: {
            type: Date,
            default: null
        },
        currentplan: {
            type: Schema.Types.ObjectId,
            ref: 'Plan',
            default: "680f11c0d44970f933ae5e54"
        },
        requestPlanId: {
            type: Schema.Types.ObjectId,
            ref: 'Plan',
            default: null
        },
        planStartDate: {
            type: Date,
            default: null
        },
        planEndDate: {
            type: Date,
            default: null
        },
        subscriptionId: {
            type: String,
            default: null
        },
        stripeCustomerId: {
            type: String,
            default: null
        }
    }, {
        timestamps: true
    });

    // Add virtual population
    UserSchema.virtual('plan', {
        ref: 'Plan',
        localField: 'currentplan',
        foreignField: '_id',
        justOne: true
    });

    // Enable virtuals in toJSON and toObject
    UserSchema.set('toJSON', { virtuals: true });
    UserSchema.set('toObject', { virtuals: true });

    return mongoose.models.User || mongoose.model('User', UserSchema);
}

function chatModel() {
    const ChatSchema = new Schema({
        email: {
            type: String,
            required: true
        },
        session: [{
            id: {
                type: String,
                required: true,
            },
            title: {
                type: String,
            },
            chats: [{
                prompt: {
                    type: String,
                    required: true
                },
                response: {
                    type: String,
                },
                timestamp: {
                    type: Number,
                    required: true,
                },
                inputToken: {
                    type: Number
                },
                outputToken: {
                    type: Number
                },
                outputTime: {
                    type: Number,
                },
                chatType: {
                    type: Number,
                    required: true
                },
                fileUrls: [{
                    type: String,
                }],
                model: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'AI',
                    required: true
                },
                points: {
                    type: Number,
                    required: true
                },
                count: {
                    type: Number,
                    required: true,
                    default: 1
                }
            }]
        }],

        updatedAt: {
            type: Date,
            default: Date.now()
        }
    }, {
        timestamps: true
    });

    return mongoose.models.Chat || mongoose.model('Chat', ChatSchema);
}

function adminModel() {
    const AdminSchema = new Schema({
        systemPrompt: {
            type: String,
            required: true
        },
        totalNode: {
            type: Number,
            required: true,
            default: 19739
        }
    });

    return mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
}

function planModel() {
    const PlanSchema = new Schema({
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        description: {
            type: String,
        },
        features: {
            type: [String],
        },
        isYearlyPlan: {
            type: Boolean,
            required: true,
            default: false
        },
        priceId: {
            type: String,
            required: true
        },
        productId: {
            type: String,
            required: true
        },
        points: {
            type: Number,
            required: true,
            default: 0
        },
        bonusPoints: {
            type: Number,
            required: true,
            default: 0
        },
        activeModels: {
            type: [Schema.Types.ObjectId],
            ref: 'AI',
            default: []
        },
        isActive: {
            type: Boolean,
            default: true
        },
        order: {
            type: Number,
            required: true,
            default: 0
        }
    }, {
        timestamps: true
    });

    return mongoose.models.Plan || mongoose.model('Plan', PlanSchema);
}

function planHistoryModel() {
    const PlanHistorySchema = new Schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        planId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Plan',
        },
        price: {
            type: Number,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now()
        }
    }, {
        timestamps: true
    });

    return mongoose.models.PlanHistory || mongoose.model('PlanHistory', PlanHistorySchema);
}

function aiModel() {
    const AiSchema = new Schema({
        name: {
            type: String,
            required: true
        },
        inputCost: {
            type: Number,
            required: true
        },
        outputCost: {
            type: Number,
            required: true
        },
        multiplier: {
            type: Number,
            required: true
        },
        model: {
            type: String,
            required: true
        },
        provider: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        }
    });

    return mongoose.models.Ai || mongoose.model('Ai', AiSchema);
}

function usageStateModel() {
    const UsageStatsSchema = new Schema({
        date: {
            type: Date,
            required: true,
            index: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true, 
            index: true
        },
        modelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AI',
            required: true,
            index: true
        },
        planId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Plan',
            required: true,
            index: true
        },
        stats: {
            tokenUsage: {
                input: { type: Number, default: 0 },
                output: { type: Number, default: 0 },
                total: { type: Number, default: 0 }
            },
            pointsUsage: { type: Number, default: 0 },
        }
    }, {
        timestamps: true
    });

    return mongoose.models.UsageStats || mongoose.model('UsageStats', UsageStatsSchema);
}

export default db;