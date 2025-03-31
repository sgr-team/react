export class LimitError {
  constructor(
    public message: string,
    public limit: string
  ) { }
}
