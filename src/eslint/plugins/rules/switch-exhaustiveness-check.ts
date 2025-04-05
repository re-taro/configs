import { getConstrainedTypeAtLocation } from '@typescript-eslint/type-utils';
import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';

type MessageIds = 'switchIsMissingDefaultCase' | 'shouldUseSatisfiesNever';

export const switchExhaustivenessCheck: ESLintUtils.RuleModule<MessageIds> = ESLintUtils.RuleCreator.withoutDocs({
	create: (context) => {
		const services = ESLintUtils.getParserServices(context);

		return {
			SwitchStatement: (node) => {
				const discriminantType = getConstrainedTypeAtLocation(services, node.discriminant);

				if (!discriminantType.isUnion() || !discriminantType.types.every((t) => t.isLiteral())) {
					return;
				}

				const defaultCase = node.cases.find((caseNode) => caseNode.test == null);

				if (!defaultCase) {
					context.report({
						node,
						messageId: 'switchIsMissingDefaultCase',
					});

					return;
				}

				const hasExhaustivenessCheck = defaultCase.consequent.some((stmt) => {
					if (stmt.type === AST_NODE_TYPES.ExpressionStatement) {
						const expr = stmt.expression;

						// 対象が satisfies never の場合
						if (
							expr.type === AST_NODE_TYPES.TSSatisfiesExpression &&
							expr.typeAnnotation.type === AST_NODE_TYPES.TSNeverKeyword
						) {
							return true;
						}

						// 明示的に as never を使っているケースも許容したい場合はこちらもチェック
						if (
							expr.type === AST_NODE_TYPES.TSAsExpression &&
							expr.typeAnnotation.type === AST_NODE_TYPES.TSNeverKeyword
						) {
							return true;
						}
					}

					return false;
				});

				if (!hasExhaustivenessCheck) {
					context.report({
						node: defaultCase,
						messageId: 'shouldUseSatisfiesNever',
					});
				}
			},
		};
	},
	meta: {
		messages: {
			shouldUseSatisfiesNever: 'Should use `satisfies never` syntax in "default" case for exhaustiveness checking.',
			switchIsMissingDefaultCase:
				'Switch is missing a `default` case with `satisfies never` for exhaustiveness checking.',
		},
		schema: [],
		type: 'problem',
	},
	defaultOptions: [],
});
