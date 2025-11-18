import { createRateLimiter, rateLimiters } from './rate-limit';

describe('Rate Limiting', () => {
  let mockReq;
  let mockRes;
  let mockHandler;

  beforeEach(() => {
    // Reset mocks before each test
    mockReq = {
      headers: {},
      query: {},
      connection: { remoteAddress: '127.0.0.1' }
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      setHeader: jest.fn()
    };

    mockHandler = jest.fn(async (req, res) => {
      return res.status(200).json({ success: true });
    });

    // Clear mocks
    jest.clearAllMocks();
  });

  describe('createRateLimiter', () => {
    it('should allow requests within rate limit', async () => {
      const rateLimiter = createRateLimiter({ max: 5, windowMs: 60000 });
      const wrappedHandler = rateLimiter(mockHandler);

      await wrappedHandler(mockReq, mockRes);

      expect(mockHandler).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalledWith(429);
    });

    it('should set rate limit headers', async () => {
      const rateLimiter = createRateLimiter({ max: 10, windowMs: 60000 });
      const wrappedHandler = rateLimiter(mockHandler);

      await wrappedHandler(mockReq, mockRes);

      expect(mockRes.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', 10);
      expect(mockRes.setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', expect.any(Number));
      expect(mockRes.setHeader).toHaveBeenCalledWith('X-RateLimit-Reset', expect.any(Number));
    });

    it('should use API key for identification when provided', async () => {
      mockReq.headers['x-api-key'] = 'test-api-key-123';
      
      const rateLimiter = createRateLimiter({ max: 5 });
      const wrappedHandler = rateLimiter(mockHandler);

      await wrappedHandler(mockReq, mockRes);

      expect(mockHandler).toHaveBeenCalled();
    });

    it('should use IP address when no API key provided', async () => {
      mockReq.connection.remoteAddress = '192.168.1.1';
      
      const rateLimiter = createRateLimiter({ max: 5 });
      const wrappedHandler = rateLimiter(mockHandler);

      await wrappedHandler(mockReq, mockRes);

      expect(mockHandler).toHaveBeenCalled();
    });
  });

  describe('Preset Rate Limiters', () => {
    it('should have strict rate limiter', () => {
      expect(rateLimiters.strict).toBeDefined();
      expect(typeof rateLimiters.strict).toBe('function');
    });

    it('should have standard rate limiter', () => {
      expect(rateLimiters.standard).toBeDefined();
      expect(typeof rateLimiters.standard).toBe('function');
    });

    it('should have lenient rate limiter', () => {
      expect(rateLimiters.lenient).toBeDefined();
      expect(typeof rateLimiters.lenient).toBe('function');
    });

    it('should have auth rate limiter', () => {
      expect(rateLimiters.auth).toBeDefined();
      expect(typeof rateLimiters.auth).toBe('function');
    });
  });
});
