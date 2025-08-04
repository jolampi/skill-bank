"use client";

import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

import ConsultantCard from "./components/ConsultantCard";
import ConsultantFilters from "./components/ConsultantFilters";
import NewFilterForm from "./components/NewFilterForm";

import Modal from "@/components/Modal";
import withAuthorization from "@/components/withAuthorization";
import { Consultant, findConsultants, SkillFilter } from "@/services/backend/consultants";

const ConsultantsPage: React.FC = () => {
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [consultantToView, setConsultantToView] = useState<Consultant | null>(null);
  const [filters, setFilters] = useState<SkillFilter[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    findConsultants(filters)
      .then(setConsultants)
      .finally(() => setLoading(false));
  }, [filters]);

  function handleAdd(newFilter: SkillFilter) {
    const newFilters = filters.filter((x) => x.label !== newFilter.label);
    newFilters.push(newFilter);
    newFilters.sort((a, b) => a.label.localeCompare(b.label));
    setFilters(newFilters);
  }

  return (
    <div>
      <Container maxWidth="md">
        <Typography variant="h5">Search for consultants</Typography>
        <Paper variant="outlined" sx={{ padding: 2, maxWidth: 700, marginX: "auto", marginY: 3 }}>
          <NewFilterForm disabled={loading} onSubmit={handleAdd} />
        </Paper>
        <ConsultantFilters disabled={loading} value={filters} onChange={setFilters} />
        <Divider variant="middle" sx={{ marginY: 3 }} />
        {loading ? (
          <LinearProgress />
        ) : (
          <div>
            <Typography>{getResultText(consultants.length)}</Typography>
            {consultants.map((consultant) => (
              <ConsultantCard
                key={consultant.id}
                value={consultant}
                onClick={() => setConsultantToView(consultant)}
              />
            ))}
          </div>
        )}
      </Container>

      <Modal fullWidth open={!!consultantToView} onClose={() => setConsultantToView(null)}>
        <pre>{JSON.stringify(consultantToView, undefined, 2)}</pre>
      </Modal>
    </div>
  );
};

export default withAuthorization(ConsultantsPage);

function getResultText(results: number) {
  if (results > 0) {
    return `Found ${results} results:`;
  } else {
    return `No results with provided search terms.`;
  }
}
