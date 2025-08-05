"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, gql } from "@apollo/client";
import { useState } from "react";

const GET_MODELS = gql`
  query GetModels($brandId: ID!, $sortBy: sortBy!) {
    findBrandModels(id: $brandId, sortBy: $sortBy) {
      id
      name
      type
      image
    }
  }
`;

export default function ModelsPage() {
  const params = useParams();
  const router = useRouter();

  if (!params?.brandId) return <p>Brand ID not found in URL.</p>;

  const { brandId } = params;

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const sortBy = { field: "name", order: "ASC" };

  const { loading, error, data } = useQuery(GET_MODELS, {
    variables: { brandId, sortBy },
  });

  if (loading) return <p>Loading models...</p>;
  if (error) return <p>Error loading models: {error.message}</p>;

  const filteredModels = data.findBrandModels
    .filter((model: any) =>
      model.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((model: any) =>
      filterType ? model.type.toLowerCase() === filterType.toLowerCase() : true
    );

  return (
    <div>
      <h1>Models for Brand: {brandId}</h1>

      <input
        type="text"
        placeholder="Search models"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 10, display: "block" }}
      />

      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        style={{ marginBottom: 10 }}
      >
        <option value="">All Types</option>
        <option value="electric">Electric</option>
        <option value="acoustic">Acoustic</option>
        <option value="bass">Bass</option>
      </select>

      <ul>
        {filteredModels.map((model: any) => (
          <li
            key={model.id}
            onClick={() => router.push(`/guitar/${brandId}/${model.id}`)}
            style={{ cursor: "pointer", color: "blue", textDecoration: "underline", marginBottom: 10 }}
          >
            {model.name} ({model.type})
          </li>
        ))}
      </ul>
    </div>
  );
}
