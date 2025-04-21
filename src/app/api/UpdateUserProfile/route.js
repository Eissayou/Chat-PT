import {MongoClient, ServerApiVersion} from 'mongodb';
import { NextResponse } from 'next/server';
import {jwtVerify} from 'jose';

const uri = process.env.MONGODB_URI; // Get from environment variable

// Create the MongoClient outside the handler
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});
await client.connect();

const col = client.db('trainerApp').collection('users');

export async function PUT(req) {
    try {
        const { token, profile } = await req.json();

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        const username = payload.username;

        const now = new Date();
        const allowed = [
            'name', 'gender', 'weightLbs', 'heightCm', 'age',
            'bestMileSec', 'bestDeadliftLbs', 'bestBenchLbs', 'bestSquatLbs'
        ];
        const $set = {};
        allowed.forEach(k => { if (profile[k] !== undefined) $set[k] = profile[k]; })
        
        if (!Object.keys($set).length)
            return NextResponse.json({ error: 'Empty profile update' }, { status: 400 });

        const result = await col.findOneAndUpdate(
            { username },
            { $set, $setOnInsert: { createdAt: now }, $currentDate: { updatedAt: true } },
            { upsert: true, returnDocument: 'after' }
        );

        return NextResponse.json({ profile: result.value });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}