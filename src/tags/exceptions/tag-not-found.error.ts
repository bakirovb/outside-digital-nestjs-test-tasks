export class TagNotFoundError extends Error {
  constructor(readonly criteria: number) {
    super(`Could not find entity Tag with id ${criteria}`);
    this.name = 'TagNotFoundError';
  }
}
