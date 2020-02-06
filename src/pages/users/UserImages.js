import React, {useRef} from "react";
import {Card, CardContent, CardHeader, CardMedia, FormControl, Grid, Link, makeStyles} from "@material-ui/core";
import i18next from 'src/i18n'


const useStyles = makeStyles(theme => ({
  card: {
    marginTop: 10,
    marginBottom: 10,
  },
  card_header: {
    paddingBottom: 5,
  },
  card_content: {
    paddingTop: 0,
    paddingBottom: '10px !important',
  },
  images: {
    marginBottom: 10,
  },
  thumbnail: {
    padding: 2,
  },
}));

const UserImages = props => {
  const { user, form } = props;
  const classes = useStyles();
  const images = useRef();
  const urls= user.image_urls;

  return (
    <Card className={classes.card}>
      <CardHeader title={ i18next.t('views.user.photo') } className={classes.card_header} />
      <CardContent className={classes.card_content} >
        <Grid container className={classes.images}>
          {
            urls ? urls.map((url, i) => (
                <Grid key={i} item xs={4} className={classes.thumbnail}>
                  <Link href={url} target='_blank' >
                    <CardMedia component='img' src={url} />
                  </Link>
                </Grid>
              )
            ) : null
          }
        </Grid>
        {form ? (
          <FormControl fullWidth>
            <input
              id={form.id}
              name={form.id}
              type="file"
              ref={images}
            />
          </FormControl>
        ) : null
        }
      </CardContent>
    </Card>
  );
};

export default UserImages;
