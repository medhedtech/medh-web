import { apiBaseUrl } from '../apis';
import { getCoursesWithFields } from '../apis/course/course';

describe('getCoursesWithFields API', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  it('should construct URL with currency filter', () => {
    const options = {
      page: 1,
      limit: 10,
      status: 'Published',
      fields: ['card'],
      filters: {
        currency: 'INR'
      }
    };

    const url = getCoursesWithFields(options);

    // Check if the URL contains the currency filter
    expect(url).toContain('fields=card');
    expect(url).toContain('filters[currency]=INR');
  });

  it('should handle multiple filters', () => {
    const options = {
      page: 1,
      limit: 10,
      status: 'Published',
      fields: ['card', 'details'],
      filters: {
        currency: 'INR',
        status: 'Published'
      }
    };

    const url = getCoursesWithFields(options);
    
    // Check if the URL contains all filters
    expect(url).toContain('fields=card,details');
    expect(url).toContain('filters[currency]=INR');
    expect(url).toContain('filters[status]=Published');
  });

  it('should handle pagination parameters', () => {
    const options = {
      page: 2,
      limit: 20,
      fields: ['card']
    };

    const url = getCoursesWithFields(options);
    expect(url).toContain('page=2');
    expect(url).toContain('limit=20');
  });

  it('should handle response format', async () => {
    const options = {
      page: 1,
      limit: 10,
      status: 'Published',
      fields: ['card'],
      filters: {
        currency: 'INR'
      }
    };
    const mockResponse = {
      success: true,
      data: [
        {
          _id: "67bd82da8a56e7688dd03497",
          prices: [
            {
              currency: "INR",
              individual: 21600,
              batch: 12000,
              min_batch_size: 2,
              max_batch_size: 10,
              early_bird_discount: 0,
              group_discount: 0,
              is_active: true,
              _id: "67ebbcc574312eae83aecd11"
            }
          ]
        }
      ],
      pagination: {
        total: 79,
        totalPages: 8,
        currentPage: 1,
        limit: 10,
        hasNextPage: true,
        hasPrevPage: false
      }
    };

    // Mock the fetch function
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })
    );

    const response = await fetch(getCoursesWithFields(options));
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.data[0]).toHaveProperty('prices');
    expect(data.data[0].prices[0]).toHaveProperty('currency', 'INR');
    expect(data.pagination).toHaveProperty('total');
    expect(data.pagination).toHaveProperty('currentPage');
  });
}); 