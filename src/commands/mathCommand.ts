import { Command, CommandContext } from "../components/console/types"

/**
 * Safely evaluates a mathematical expression with only allowed symbols.
 */
function safeEvaluate(expression: string): number | string {
    // Allowed characters in the math expression
    const allowedChars = /^[0-9+\-*/%^().\s]+$/;

    if (!allowedChars.test(expression)) {
        return "&eError: Expression contains invalid characters.&r";
    }

    try {
        // Replace ^ with ** for exponentiation
        const sanitizedExpression = expression.replace(/\^/g, "**");

        // Use Function constructor to evaluate the expression safely
        const result = new Function(`return (${sanitizedExpression})`)();

        if (isNaN(result) || typeof result !== "number") {
            return "&eError: Invalid mathematical expression.&r";
        }
        return result;
    } catch (err) {
        return "&eError: Could not evaluate the expression.&r";
    }
}

export const mathCommand: Command = {
    name: "math",
    description: "Evaluates a mathematical expression.",
    usage: "math <expression>",
    parseParams: (args) => {
        if (args.length === 0) return null;
        const expression = args.join(" ");
        return { expression };
    },
    run: (args, params, context: CommandContext) => {
        const { expression } = params;

        const result = safeEvaluate(expression);

        if (typeof result === "string") {
            // Error message
            return { completed: false, status: result };
        }

        // Successfully evaluated result
        return { completed: true, status: `Result: ${result}` };
    },
};
