import LikeController from '../controllers/like.controller.js';
import CommentController from '../controllers/comment.controller.js';

describe('Malformed Parameter Validation Tests', () => {
  it('should return HTTP 400 for malformed page_id on LikeController.toggleLike', async () => {
    const req = {
      params: { page_id: '123' },
      user: { id: 'user-id-123' }
    };
    let statusCode;
    let jsonBody;
    const res = {
      status: (code) => {
        statusCode = code;
        return {
          json: (body) => {
            jsonBody = body;
          }
        };
      }
    };

    await LikeController.toggleLike(req, res);

    expect(statusCode).toBe(400);
    expect(jsonBody.message).toBe('Invalid page_id format');
  });

  it('should return HTTP 400 for malformed page_id on CommentController.createComment', async () => {
    const req = {
      params: { page_id: '123' },
      user: { id: 'user-id-123' },
      body: { content: 'Test comment' }
    };
    let statusCode;
    let jsonBody;
    const res = {
      status: (code) => {
        statusCode = code;
        return {
          json: (body) => {
            jsonBody = body;
          }
        };
      }
    };

    await CommentController.createComment(req, res);

    expect(statusCode).toBe(400);
    expect(jsonBody.message).toBe('Invalid page_id format');
  });
});
