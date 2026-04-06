import { Injectable, Logger } from '@nestjs/common';

type EnrichedUser = {
  id: string;
  name: string | null;
  picture: string | null;
};

@Injectable()
export class AuthUserClient {
  private readonly logger = new Logger(AuthUserClient.name);
  private readonly defaultAuthServiceUrl = 'http://localhost:3001';

  async getUsersByIds(userIds: string[]): Promise<Record<string, EnrichedUser>> {
    const uniqueUserIds = [...new Set(userIds.filter(Boolean))];

    if (!uniqueUserIds.length) {
      return {};
    }

    const authServiceUrl = process.env.AUTH_SERVICE_URL || this.defaultAuthServiceUrl;
    if (!process.env.AUTH_SERVICE_URL) {
      this.logger.warn(
        `AUTH_SERVICE_URL is not set, using fallback: ${this.defaultAuthServiceUrl}`,
      );
    }

    try {
      const baseUrl = authServiceUrl.replace(/\/$/, '');
      const response = await fetch(`${baseUrl}/auth/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userIds: uniqueUserIds }),
      });

      if (!response.ok) {
        this.logger.warn(`Unable to enrich users, auth service returned ${response.status}`);
        return {};
      }

      const payload = await response.json();

      if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
        return {};
      }

      return payload as Record<string, EnrichedUser>;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(`Unable to enrich users: ${message}`);
      return {};
    }
  }
}