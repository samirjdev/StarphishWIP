// src/components/EmailCard.js
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardHeader } from '@mui/material';

const EmailCard = ({ title, email, isPhishing, style }) => {
  return (
    <Card style={{ ...style, backgroundColor: '#333', color: 'white', userSelect: 'none', overflow: 'hidden', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 5px #2596be' }}> {/* Ensure overflow is hidden for the Card */}
      <CardHeader 
        title={title} 
        titleTypographyProps={{ variant: 'body2', userSelect: 'none', fontWeight: 'bold'}} // Adjust typography variant if needed
        style={{ padding: '16px', userSelect: 'none', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '1.5' }}
      />
      <CardContent style={{ padding: '16px', userSelect: 'none', maxHeight: '340px', overflow: 'auto' }}>
        <Typography variant="body2" style={{ marginBottom: '16px', userSelect: 'none' }}>{email}</Typography>
      </CardContent>
    </Card>
  );
};


export default EmailCard;