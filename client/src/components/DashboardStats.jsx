import { Box, Card, Typography, alpha } from "@mui/material";

export function StatCard({ title, value, icon, trend, className }) {
  return (
    <Card 
      elevation={0}
      sx={{ 
        p: 3, 
        height: '100%',
        borderRadius: 2,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        bgcolor: (theme) => theme.palette.background.paper,
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => `0 8px 24px ${alpha(theme.palette.primary.main, 0.12)}`,
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography 
            variant="subtitle2" 
            color="text.secondary" 
            fontWeight={500}
            gutterBottom
          >
            {title}
          </Typography>
          <Typography 
            variant="h4" 
            component="div" 
            fontWeight="bold" 
            sx={{ mt: 1 }}
          >
            {value}
          </Typography>
          {trend && (
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mt: 1,
                px: 1, 
                py: 0.5, 
                borderRadius: 1,
                width: 'fit-content',
                bgcolor: (theme) => 
                  trend.direction === "up" 
                    ? alpha(theme.palette.success.main, 0.1)
                    : trend.direction === "down"
                      ? alpha(theme.palette.error.main, 0.1)
                      : alpha(theme.palette.primary.main, 0.1)
              }}
            >
              <Typography 
                variant="caption" 
                sx={{ 
                  fontWeight: 600,
                  color: (theme) => 
                    trend.direction === "up" 
                      ? theme.palette.success.main
                      : trend.direction === "down"
                        ? theme.palette.error.main
                        : theme.palette.primary.main
                }}
              >
                {trend.direction === "up" && "↑ "}
                {trend.direction === "down" && "↓ "}
                {trend.value}
              </Typography>
            </Box>
          )}
        </Box>
        <Box 
          sx={{ 
            p: 1.5,
            borderRadius: '50%',
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {icon}
        </Box>
      </Box>
    </Card>
  );
}

export function StatsGrid({ children }) {
  return (
    <Box 
      sx={{ 
        display: 'grid', 
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)'
        },
        gap: 3,
      }}
    >
      {children}
    </Box>
  );
}

export function DashboardSection({ title, children, sx }) {
  return (
    <Box sx={{ mb: 4, ...sx }}>
      <Typography 
        variant="h6" 
        component="h2" 
        gutterBottom 
        sx={{ 
          mb: 3, 
          fontWeight: 600, 
          position: 'relative',
          '&:after': {
            content: '""',
            position: 'absolute',
            left: 0,
            bottom: -8,
            width: 40,
            height: 3,
            bgcolor: 'primary.main',
            borderRadius: 1,
          }
        }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
}
