import React, { useEffect, useMemo, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { Tabla } from "components/Tabla";
import { COHORTE_BY_ID } from "apollo/querys/cohortes";
import { Button, ButtonGroup, Snackbar } from "@material-ui/core";
import { MailOutlineRounded, FileCopyRounded } from "@material-ui/icons";
import { useCopyToClipboard } from "react-use";
import { Alert } from "@material-ui/lab";
import { useHistory } from "react-router-dom";

function Alumns({
  className,
  cohorte,
  data: componentData,
  loading: componentLoading,
}) {
  const [
    execute,
    { loading: queryLoading, error, data: preData },
  ] = useLazyQuery(COHORTE_BY_ID);

  useEffect(() => {
    if (cohorte)
      execute({
        variables: { id: cohorte.id },
      });
  }, [cohorte, execute]);

  const loading = useMemo(() => queryLoading || componentLoading, [
    queryLoading,
    componentLoading,
  ]);

  const data = useMemo(() => preData || componentData, [
    preData,
    componentData,
  ]);

  const [{ value: copyValue }, copyToClipboard] = useCopyToClipboard();

  const [showSnackbar, setShowSnackbar] = useState(false);

  const { push } = useHistory();

  useEffect(() => {
    if (copyValue) {
      setShowSnackbar(true);
    }
  }, [copyValue]);

  const tableData = useMemo(
    () => ({
      loading,
      error,
      data: data?.cohortes[0].users || undefined,
      columns: [
        { key: "givenName", label: "Nombre", align: "left" },
        { key: "familyName", label: "Apellido", align: "left" },
        {
          key: "email",
          label: "Email",
          align: "left",
          component: (el) => (
            <ButtonGroup>
              <Button
                startIcon={<MailOutlineRounded />}
                href={`mailto: ${el.email}`}
              >
                Enviar
              </Button>
              <Button onClick={() => copyToClipboard(el.email)}>
                <FileCopyRounded />
              </Button>
            </ButtonGroup>
          ),
        },
      ],
      addButtonLabel: "Invitar estudiante",
      actions: {
        view: {
          onSubmit: (id) => push(`/profile/${id}`),
        },
      },
    }),
    [data, error, loading, copyToClipboard, push]
  );

  console.log(data?.cohortes[0].users);

  return (
    <div className={className} style={{ height: "50vh", width: "100%" }}>
      <Tabla loading={loading} data={tableData} pageSize={5} />
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="info">Email copiado al potapapeles</Alert>
      </Snackbar>
    </div>
  );
}

export default Alumns;