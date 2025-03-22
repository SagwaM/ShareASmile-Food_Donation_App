import { Box, Card, Typography, Avatar, Stack, alpha } from "@mui/material";

export function ActivityFeed({ items = [] }) {
  console.log("ActivityFeed received items:", items); // Debugging
  // Extract activities array if items is an object with "activities"
  const activities = Array.isArray(items) ? items :[];

  if (activities.length === 0) {
    return (
      <Card
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          bgcolor: (theme) => theme.palette.background.paper,
          textAlign: 'center'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No recent activity
        </Typography>
      </Card>
    );
  }

  return (
    <Stack spacing={2}>
      {activities.map((activity) => (
        <Card
          key={activity._id}
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 2,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            bgcolor: (theme) => theme.palette.background.paper,
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-2px)',
            }
          }}
        >
          <Box sx={{ display: 'flex', gap: 2 }}>
            {activity.icon && (
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: (theme) => {
                    switch (activity.status) {
                      case 'AVAILABLE':
                        return alpha(theme.palette.success.main, 0.12);
                      case 'warning':
                        return alpha(theme.palette.warning.main, 0.12);
                      case 'error':
                        return alpha(theme.palette.error.main, 0.12);
                      case 'info':
                      default:
                        return alpha(theme.palette.primary.main, 0.12);
                    }
                  },
                  color: (theme) => {
                    switch (activity.status) {
                      case 'available':
                        return theme.palette.success.main;
                      case 'warning':
                        return theme.palette.warning.main;
                      case 'error':
                        return theme.palette.error.main;
                      case 'info':
                      default:
                        return theme.palette.primary.main;
                    }
                  }
                }}
              >
                {activity.icon}
              </Avatar>
            )}
          
              <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                  Donation: {activity.food_name}
                </Typography>
                <Typography variant="subtitle2" fontWeight={500}>
                  Donation Status: {activity.status}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {activity.claimed_by && activity.claimed_by?.length > 0
                  ? `Claimed by: ${activity.claimed_by.map(user => user.name).join(", ")}`
                  : "Not yet claimed"}
                </Typography>
                <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: 'block' }}>
                {new Date(activity.created_at).toLocaleString()}
                </Typography>
              </Box>
              </Box>
          </Card>
      ))}
    </Stack>
  );
}
export default ActivityFeed;
