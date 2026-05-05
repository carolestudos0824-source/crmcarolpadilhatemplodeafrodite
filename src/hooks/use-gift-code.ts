export function useGiftCode() { 
  return { 
    checkCode: async () => ({ success: false }), 
    redeem: async () => ({ success: false }), 
    loading: false 
  }; 
}
