import { Scalar } from '@nestjs/graphql';

@Scalar('DateTime')
export class DateTimeScalar {
  serialize(value: Date) {
    return value.toISOString(); // outgoing
  }

  parseValue(value: string) {
    return new Date(value); // incoming from variables
  }

  parseLiteral(ast) {
    if (ast.kind === 'StringValue') {
      return new Date(ast.value);
    }
    return null;
  }
}
