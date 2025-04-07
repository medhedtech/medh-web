import { renderHook } from '@testing-library/react-hooks';
import { useCurrencyCourses } from '../hooks/useCurrencyCourses';
import axios from 'axios';
import { apiBaseUrl } from '../apis';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
  length: 0,
  key: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('useCurrencyCourses', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
  });

  it('should fetch courses with currency filter', async () => {
    const mockCourseResponse = {
      data: {
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
      }
    };

    const mockLocationResponse = {
      data: {
        country_code: 'IN',
        currency: 'INR'
      }
    };

    mockedAxios.get
      .mockResolvedValueOnce(mockLocationResponse)
      .mockResolvedValueOnce(mockCourseResponse);

    const { result, waitForNextUpdate } = renderHook(() => useCurrencyCourses());

    // Initial state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.courses).toEqual([]);

    await waitForNextUpdate();

    // After location fetch
    expect(result.current.userLocation).toEqual({
      country_code: 'IN',
      currency: 'INR'
    });

    await waitForNextUpdate();

    // After courses fetch
    expect(result.current.isLoading).toBe(false);
    expect(result.current.courses).toEqual(mockCourseResponse.data.data);
    expect(result.current.error).toBeNull();

    // Verify API calls
    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('/ip-api'));
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining(`${apiBaseUrl}/courses/fields`),
      expect.objectContaining({
        params: expect.objectContaining({
          filters: expect.objectContaining({
            currency: 'INR'
          })
        })
      })
    );
  });

  it('should use cached location if available', async () => {
    const cachedLocation = {
      country_code: 'IN',
      currency: 'INR'
    };
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(cachedLocation));

    const mockCourseResponse = {
      data: {
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
      }
    };

    mockedAxios.get.mockResolvedValueOnce(mockCourseResponse);

    const { result, waitForNextUpdate } = renderHook(() => useCurrencyCourses());

    await waitForNextUpdate();

    expect(result.current.userLocation).toEqual(cachedLocation);
    expect(mockedAxios.get).not.toHaveBeenCalledWith(expect.stringContaining('/ip-api'));
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining(`${apiBaseUrl}/courses/fields`),
      expect.objectContaining({
        params: expect.objectContaining({
          filters: expect.objectContaining({
            currency: 'INR'
          })
        })
      })
    );
  });

  it('should handle API errors gracefully', async () => {
    mockedAxios.get.mockRejectedValue(new Error('API Error'));

    const { result, waitForNextUpdate } = renderHook(() => useCurrencyCourses());

    await waitForNextUpdate();

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeTruthy();
    expect(result.current.courses).toEqual([]);
  });
}); 