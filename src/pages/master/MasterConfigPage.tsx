import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPricingConfig, updatePricingConfig, PricingConfig } from '../../api/pricing';

export const MasterConfigPage: React.FC = () => {
  const qc = useQueryClient();
  const [formData, setFormData] = useState<PricingConfig | null>(null);

  const { data: config, isLoading } = useQuery({
    queryKey: ['pricingConfig'],
    queryFn: getPricingConfig,
  });

  useEffect(() => {
    if (config) {
      setFormData(config);
    }
  }, [config]);

  const mutation = useMutation({
    mutationFn: (newConfig: PricingConfig) => updatePricingConfig(newConfig),
    onSuccess: (updatedConfig) => {
      qc.setQueryData(['pricingConfig'], updatedConfig);
      alert('Pricing configuration updated successfully!');
    },
    onError: () => {
      alert('Failed to update pricing configuration.');
    }
  });

  if (isLoading || !formData) {
    return <div className="p-8"><p>Loading...</p></div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: parseFloat(e.target.value) || 0,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      mutation.mutate(formData);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink-900">Master Configuration</h1>
        <p className="text-sm text-ink-500 mt-0.5">Edit dynamic pricing formula and surge charges</p>
      </div>

      <div className="card p-6 border border-surface-200 bg-white rounded-xl shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label font-semibold text-sm text-ink-900 mb-1.5 block">Base Rate Per Page ($)</label>
            <input
              type="number"
              step="any"
              name="baseRatePerPage"
              className="input w-full px-3 py-2 border border-surface-300 rounded-lg"
              value={formData.baseRatePerPage}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="label font-semibold text-sm text-ink-900 mb-1.5 block">Technical Subject Multiplier (e.g. 1.5x)</label>
            <input
              type="number"
              step="any"
              name="technicalSubjectMultiplier"
              className="input w-full px-3 py-2 border border-surface-300 rounded-lg"
              value={formData.technicalSubjectMultiplier}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="label font-semibold text-sm text-ink-900 mb-1.5 block">Urgency &lt;= 24h Multiplier (e.g. 2.0x)</label>
            <input
              type="number"
              step="any"
              name="urgency24hMultiplier"
              className="input w-full px-3 py-2 border border-surface-300 rounded-lg"
              value={formData.urgency24hMultiplier}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="label font-semibold text-sm text-ink-900 mb-1.5 block">Urgency &lt;= 72h Multiplier (e.g. 1.5x)</label>
            <input
              type="number"
              step="any"
              name="urgency72hMultiplier"
              className="input w-full px-3 py-2 border border-surface-300 rounded-lg"
              value={formData.urgency72hMultiplier}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="label font-semibold text-sm text-ink-900 mb-1.5 block">Surge Charge Multiplier (Default 1.0x)</label>
            <input
              type="number"
              step="any"
              name="surgeChargeMultiplier"
              className="input w-full px-3 py-2 border border-surface-300 rounded-lg"
              value={formData.surgeChargeMultiplier}
              onChange={handleChange}
              required
            />
            <p className="text-xs text-ink-400 mt-1">Increase this value during high demand (e.g., 1.2 for 20% increase).</p>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="btn-primary px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
