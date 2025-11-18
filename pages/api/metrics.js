import { register } from 'prom-client';
import logger from '../../utils/logger';

/**
 * Prometheus metrics endpoint
 * Exposes application metrics in Prometheus format
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Set content type for Prometheus
    res.setHeader('Content-Type', register.contentType);
    
    // Get metrics from the registry
    const metrics = await register.metrics();
    
    return res.status(200).send(metrics);
  } catch (error) {
    logger.error('Error generating metrics', error);
    return res.status(500).json({ error: 'Failed to generate metrics' });
  }
}
