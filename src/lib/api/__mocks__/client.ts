// Central jest manual mock for api client
// Provides configurable handlers for get/post without performing real HTTP calls.

type MethodHandler = jest.Mock;

class MockApiClient {
  get: MethodHandler = jest.fn();
  post: MethodHandler = jest.fn();
}

const apiClient = new MockApiClient();

// Default success shape to avoid undefined property access in contexts
apiClient.get.mockImplementation(async (url: string) => ({
  data: {
    status: 'success',
    data: {
      profile: { id: 0, first_name: '', last_name: '', approval_status: 'pending' },
      talent: { primary_profile_id: 0, profiles: [] }
    }
  },
  url
}));
apiClient.post.mockImplementation(async (url: string, body?: unknown) => ({ status: 200, data: { message: 'ok' }, url, body }));

export default apiClient;
export const setAuthToken = jest.fn();
export const getActiveProfileId = jest.fn(() => null);
export const setActiveProfileId = jest.fn();