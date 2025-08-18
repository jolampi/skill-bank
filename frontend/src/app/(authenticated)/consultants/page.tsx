"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import ConsultantCard from "./components/ConsultantCard";
import ConsultantFilters from "./components/ConsultantFilters";
import ConsultantProfile from "./components/ConsultantProfile";
import NewFilterForm from "./components/NewFilterForm";

import Modal from "@/components/Modal";
import { Consultant, findConsultants, SkillFilter } from "@/services/backend/consultants";

export default function ConsultantsPage() {
  const [consultantToView, setConsultantToView] = useState<Consultant | null>(null);
  const [filters, setFilters] = useState<SkillFilter[]>([]);
  const consultantQuery = useQuery({
    queryKey: ["consultants", filters],
    queryFn: () => findAndPrepareConsultants(filters),
  });

  const loading = consultantQuery.isLoading;

  function handleAdd(newFilter: SkillFilter) {
    const newFilters = filters.filter((x) => x.label !== newFilter.label);
    newFilters.push(newFilter);
    newFilters.sort((a, b) => a.label.localeCompare(b.label));
    setFilters(newFilters);
  }

  function handleCloseProfile() {
    setConsultantToView(null);
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
        {consultantQuery.isLoading && <LinearProgress />}
        {consultantQuery.isSuccess && (
          <div>
            <Typography>{getResultText(consultantQuery.data.length)}</Typography>
            {consultantQuery.data.map((consultant) => (
              <ConsultantCard
                key={consultant.id}
                value={consultant}
                onClick={() => setConsultantToView(consultant)}
              />
            ))}
          </div>
        )}
      </Container>

      <Modal fullWidth open={!!consultantToView} onClose={handleCloseProfile}>
        <Box sx={{ padding: 4 }}>
          <ConsultantProfile value={consultantToView!} />
          <Box textAlign="right">
            <Button onClick={handleCloseProfile}>Close</Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

async function findAndPrepareConsultants(
  filters: SkillFilter[],
): Promise<ReadonlyArray<Consultant>> {
  const results = await findConsultants(filters);
  results.forEach((consultant) => {
    consultant.skills.sort((a, b) => a.label.localeCompare(b.label));
  });
  return results;
}

function getResultText(results: number) {
  if (results > 0) {
    return `Found ${results} results:`;
  } else {
    return `No results with provided search terms.`;
  }
}
