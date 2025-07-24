"use client";

import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

import ConsultantCard from "./components/ConsultantCard";
import ConsultantFilters from "./components/ConsultantFilters";

import withAuthorization from "@/components/withAuthorization";
import { Consultant, findConsultants, SkillFilter } from "@/services/backend/consultants";

const ConsultantsPage: React.FC = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [filters, setFilters] = useState<SkillFilter[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    findConsultants(filters)
      .then(setConsultants)
      .finally(() => setLoading(false));
  }, [filters]);

  function getResultText(results: number) {
    if (results > 0) {
      return `Found ${results} results:`;
    } else {
      return `No results with provided search terms.`;
    }
  }

  return (
    <div>
      <Container maxWidth="md">
        <ConsultantFilters disabled={loading} value={filters} onChange={setFilters} />
        <Divider variant="middle" sx={{ marginY: 3 }} />
        {loading ? (
          <LinearProgress />
        ) : (
          <div>
            <Typography>{getResultText(consultants.length)}</Typography>
            {consultants.map((x) => (
              <ConsultantCard key={x.id} consultant={x} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default withAuthorization(ConsultantsPage);
