export class MusicValidation {

  static validateId(id: string): number {
    const parsedId = Number(id)

    if (isNaN(parsedId) || parsedId <= 0) {
      throw new Error("Invalid music id")
    }

    return parsedId
  }
}