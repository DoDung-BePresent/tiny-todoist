import { Helmet } from 'react-helmet-async';

type PageHelmetProps = {
  title: string;
  description?: string;
};

const APP_NAME = 'Tiny Todoist';

export const PageHelmet = ({ title, description }: PageHelmetProps) => {
  const fullTitle = `${title} | ${APP_NAME}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && (
        <meta
          name='description'
          content={description}
        />
      )}
    </Helmet>
  );
};
