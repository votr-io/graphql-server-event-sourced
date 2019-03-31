export interface Handler<Context, Input, Output, HanderInput = Input> {
  authenticate?(ctx: Context): string;
  authorize?(ctx: Context, input: Input): string;
  defaults?(input: Input): HanderInput;
  validate?(input: HanderInput): string;
  handleRequest(ctx: Context, input: HanderInput): Output;
}

export function useHandler<Context, Input, Output, HanderInput = Input>(
  handler: Handler<Context, Input, Output, HanderInput>
): (ctx: Context, input: Input) => Output {
  return (ctx, input) => {
    if (handler.authenticate) {
      const error = handler.authenticate(ctx);
      if (error) throw new Error(`authentication error: ${error}`);
    }

    if (handler.authorize) {
      const error = handler.authorize(ctx, input);
      if (error) throw new Error(`authorization error: ${error}`);
    }

    const handlerInput = handler.defaults ? handler.defaults(input) : input;

    if (handler.validate) {
      const error = handler.validate(handlerInput as HanderInput);
      if (error) throw new Error(`validation error: ${error}`);
    }

    if (handler.validate) {
      const error = handler.validate(handlerInput as HanderInput);
      if (error) throw new Error(`validation error: ${error}`);
    }

    return handler.handleRequest(ctx, handlerInput as HanderInput);
  };
}
