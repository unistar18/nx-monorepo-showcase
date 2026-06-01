export type DomainLibType = 'feature' | 'ui' | 'data' | 'util' | 'model';

export interface DomainLibGeneratorSchema {
  domain: string;
  name: string;
  type: DomainLibType;
  framework?: 'none' | 'react';
}
