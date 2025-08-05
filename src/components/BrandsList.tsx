'use client';

import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';

const GET_BRANDS = gql`
  query {
    brands {
      id
      name
    }
  }
`;

export default function BrandsList() {
  const { data, loading, error } = useQuery(GET_BRANDS);

  if (loading) return <p>Loading brands...</p>;
  if (error) return <p>Error loading brands: {error.message}</p>;

  return (
    <div>
      <h1>Guitar Brands</h1>
      <ul>
        {data.brands.map((brand: { id: string; name: string }) => (
          <li key={brand.id} style={{ marginBottom: 8 }}>
            <Link href={`/models/${brand.id}`} style={{ color: 'blue', textDecoration: 'underline' }}>
              {brand.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
