import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardHeader } from '@mui/material';

const EmailCard = ({ title, email, isPhishing }) => {
  return (
    <Card sx={{ maxWidth: 500, width: 500, minHeight: 450,  margin: '20px 0' }}> {/* Set a static width */}
      <CardHeader title={title} />
      <CardContent style={{ maxHeight: 200, overflow: 'auto' }}> {/* Make content scrollable */}
        <Typography variant="body2">
          {email}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default EmailCard;
