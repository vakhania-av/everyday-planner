import { Box, Button, Card, CardContent, Chip, LinearProgress, Typography } from "@mui/material";
import { TrendingUp, Whatshot } from '@mui/icons-material';
import { observer } from "mobx-react-lite";
import { useGoalStore, useTaskStore } from "../../hooks/useStores";
import { useState } from "react";

const GoalsProgress = observer(() => {
  const { streak, getProgress } = useGoalStore();
  const { tasks } = useTaskStore();
  const [expanded, setExpanded] = useState(false);

  const progress = getProgress(tasks);

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">
            My goals
          </Typography>
          <Chip icon={<Whatshot />} label={`${streak} days`} variant="outlined" />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">
              Today
            </Typography>
            <Typography variant="body2">
              {progress.daily.completed}/{progress.daily.total}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress.daily.percentage}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        {expanded && (
          <>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">
                  Week
                </Typography>
                <Typography variant="body2">
                  {progress.weekly.completed}/{progress.weekly.total}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress.weekly.percentage}
                sx={{ height: 6, borderRadius: 4 }}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">
                  Month
                </Typography>
                <Typography variant="body2">
                  {progress.monthly.completed}/{progress.monthly.total}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress.monthly.percentage}
                sx={{ height: 6, borderRadius: 4 }}
              />
            </Box>
          </>
        )}

        <Button
          size="small"
          onClick={() => setExpanded(!expanded)}
          startIcon={<TrendingUp />}
        >
          {expanded ? 'Hide' : 'More'}
        </Button>
      </CardContent>
    </Card>
  );
});

export default GoalsProgress;
