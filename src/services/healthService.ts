export class HealthService {
  constructor() {}

  async checkApplicationHealth() {
    try {
      return { status: "OK", timestamp: new Date() };
    } catch (error) {
      return { status: "ERROR", timestamp: new Date() };
    }
  }
}
