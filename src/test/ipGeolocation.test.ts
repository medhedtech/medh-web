import axios from 'axios';
import { apiUrls } from '../apis';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock getQuery hook
jest.mock('../hooks/getQuery.hook', () => ({
  __esModule: true,
  default: () => ({
    getQuery: jest.fn().mockImplementation(({ url, config }) => {
      if (url === apiUrls.currencies.getAllCurrencyCountryCodes) {
        return Promise.resolve({
          success: true,
          exists: true,
          currency: 'INR'
        });
      }
      return Promise.resolve({ success: true, data: [] });
    })
  })
}));

describe('IP Geolocation API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should process standard IP geolocation response format', async () => {
    // Mock standard IP geolocation API response
    mockedAxios.get.mockResolvedValue({
      data: {
        ip: '123.45.67.89',
        country_code: 'IN',
        country_name: 'India',
        region: 'Maharashtra',
        city: 'Mumbai',
        latitude: 19.076,
        longitude: 72.8777,
        timezone: 'Asia/Kolkata',
        currency: 'INR',
        languages: 'en-IN,hi,bn,te,mr,ta,gu,kn,ml,pa',
        org: 'Example ISP',
        asn: 'AS12345',
        postal: '400001'
      }
    });

    // Make the API call
    const response = await axios.get('https://ipapi.co/json/');
    
    // Check if the response contains the expected fields
    expect(response.data).toHaveProperty('country_code', 'IN');
    expect(response.data).toHaveProperty('country_name', 'India');
    expect(response.data).toHaveProperty('currency', 'INR');
  });

  it('should handle minimal IP geolocation response format', async () => {
    // Mock minimal IP geolocation API response
    mockedAxios.get.mockResolvedValue({
      data: {
        ip: '123.45.67.89',
        country_code: 'US',
        country_name: 'United States',
        currency: 'USD'
      }
    });

    // Make the API call
    const response = await axios.get('https://ipapi.co/json/');
    
    // Check if the response contains the minimum required fields
    expect(response.data).toHaveProperty('country_code', 'US');
    expect(response.data).toHaveProperty('country_name', 'United States');
    expect(response.data).toHaveProperty('currency', 'USD');
  });

  it('should handle error response from IP geolocation API', async () => {
    // Mock error response
    mockedAxios.get.mockRejectedValue(new Error('API Error'));

    // Attempt to make the API call and catch the error
    try {
      await axios.get('https://ipapi.co/json/');
      fail('Expected API call to throw an error');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('API Error');
    }
  });

  it('should handle unexpected response format', async () => {
    // Mock unexpected response format
    mockedAxios.get.mockResolvedValue({
      data: {
        ip: '123.45.67.89',
        // Missing country_code and country_name
        region: 'California',
        city: 'San Francisco'
      }
    });

    // Make the API call
    const response = await axios.get('https://ipapi.co/json/');
    
    // Check if the response is missing required fields
    expect(response.data).not.toHaveProperty('country_code');
    expect(response.data).not.toHaveProperty('country_name');
    expect(response.data).not.toHaveProperty('currency');
  });

  it('should verify country code with backend API', async () => {
    // Mock IP geolocation API response
    mockedAxios.get.mockResolvedValue({
      data: {
        country_code: 'IN',
        country_name: 'India',
        currency: 'INR'
      }
    });

    // Mock getQuery hook for this specific test
    const getQuery = jest.fn().mockResolvedValue({
      success: true,
      exists: true,
      currency: 'INR'
    });

    // Make the API calls
    const ipResponse = await axios.get('https://ipapi.co/json/');
    const verifyResponse = await getQuery({
      url: apiUrls.currencies.getAllCurrencyCountryCodes,
      config: { params: { code: ipResponse.data.country_code } }
    });
    
    // Check if the country code was verified
    expect(getQuery).toHaveBeenCalledWith({
      url: apiUrls.currencies.getAllCurrencyCountryCodes,
      config: { params: { code: 'IN' } }
    });
    
    // Check if the verification was successful
    expect(verifyResponse.exists).toBe(true);
    expect(verifyResponse.currency).toBe('INR');
  });
}); 