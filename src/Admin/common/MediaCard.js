import React from 'react';
import { Card, CardContent, CardMedia } from '@mui/material';
import Typography from '@mui/material/Typography';
import { NavLink } from 'react-router-dom';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  root: {
    minWidth: 345,
    width: "25%",
    transition: 'transform 0.3s ease-in-out', // Smooth zoom effect
    '&:hover': {
      transform: 'scale(1.05)', // Zoom effect
    },
  },
  media: {
    height: 300,
  },
  navLink: {
    '&:hover': {
      textDecoration: 'none', // Zoom effect
    },
    color: 'inherit', // Maintain text color
    display: 'block', // Ensure the whole card is clickable
  },
});

export default function MediaCard({ url, redirectTo, title }) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <NavLink to={redirectTo} className={classes.navLink}>
        <CardMedia className={classes.media} image={url} title={title} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {title}
          </Typography>
        </CardContent>
      </NavLink>
    </Card>
  );
}
