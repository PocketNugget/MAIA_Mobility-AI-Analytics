import { generateSolutionsForPattern } from "@/lib/groq";
import { Pattern } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";
import {mockPatterns} from "@/lib/mockPatterns";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        // Option 1: Pass full pattern as JSON string
        const patternJson = searchParams.get("pattern");

        let testPattern: Pattern= mockPatterns[0];

        const solutions = await generateSolutionsForPattern(testPattern);

        return NextResponse.json({
            success: true,
            pattern: {
                id: testPattern.id,
                title: testPattern.title
            },
            solutions
        });
    } catch (error: any) {
        console.error("Pattern analysis error:", error.message);
        return NextResponse.json(
            {
                success: false,
                error: error.message || "Failed to generate solutions"
            },
            { status: 500 }
        );
    }
}