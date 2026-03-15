import api from './client';

export interface PricingConfig {
  baseRatePerPage: number;
  technicalSubjectMultiplier: number;
  urgency24hMultiplier: number;
  urgency72hMultiplier: number;
  surgeChargeMultiplier: number;
}

export const getPricingConfig = async (): Promise<PricingConfig> => {
  const { data } = await api.get('/pricing');
  return data.data.config;
};

export const updatePricingConfig = async (config: PricingConfig): Promise<PricingConfig> => {
  const { data } = await api.put('/pricing', config);
  return data.data.config;
};
