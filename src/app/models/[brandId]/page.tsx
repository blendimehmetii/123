"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { gql, useQuery } from "@apollo/client";

const GET_MODELS = gql`
  query GetModels($brandId: ID!, $sortBy: sortBy!) {
    findBrandModels(id: $brandId, sortBy: $sortBy) {
      id
      name
      type
      image
      price
    }
  }
`;

export default function ModelsPage() {
  const router = useRouter();
  const params = useParams();
  const brandId = params.brandId;

  // Local state for filters and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5; // show 5 per page

  // Sort field and order required by the API
  const [sortBy, setSortBy] = useState({ field: "name", order: "ASC" });

  const { loading, error, data } = useQuery(GET_MODELS, {
    variables: { brandId, sortBy },
  });

  // Filter models client side for search and type
  const filteredModels = data?.findBrandModels
    ? data.findBrandModels.filter((model) => {
        return (
          model.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (filterType ? model.type === filterType : true)
        );
      })
    : [];

  // Pagination logic
  const paginatedModels = filteredModels.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const uniqueTypes = [
    ...new Set(data?.findBrandModels?.map((model) => model.type) || []),
  ];

  if (loading) return <p>Loading models...</p>;
  if (error) return <p>Error loading models: {error.message}</p>;
  if (!data?.findBrandModels.length) return <p>No models found.</p>;

  return (
    <div>
      <h1>Guitar Models for Brand {brandId}</h1>

      <input
        type="text"
        placeholder="Search models by name"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setPage(1); // reset to first page on search
        }}
        style={{ marginBottom: "10px", padding: "5px" }}
      />

      <select
        value={filterType}
        onChange={(e) => {
          setFilterType(e.target.value);
          setPage(1); // reset to first page on filter change
        }}
        style={{ marginLeft: "10px", padding: "5px" }}
      >
        <option value="">All Types</option>
        {uniqueTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <ul style={{ marginTop: "20px" }}>
        {paginatedModels.map((model) => (
          <li
            key={model.id}
            onClick={() =>
              router.push(`/guitar/${brandId}/${model.id}`)
            }
            style={{ cursor: "pointer", marginBottom: "10px" }}
          >
            <strong>{model.name}</strong> - {model.type} - ${model.price}
          </li>
        ))}
      </ul>

      <div style={{ marginTop: "20px" }}>
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          style={{ marginRight: "10px" }}
        >
          Previous
        </button>
        <button
          disabled={page * pageSize >= filteredModels.length}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
