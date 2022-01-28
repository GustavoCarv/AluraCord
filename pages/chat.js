import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import React, { useEffect, useState } from "react";
import appConfig from "../config.json";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMyNDkzMywiZXhwIjoxOTU4OTAwOTMzfQ.L3oeYCXvl5SFJI362AybIjIsCxxbhylFCfeSkbcKfnA";
const BASE_URL = "https://zjjdyrcszbvrpiznxgtm.supabase.co";
const supabaseClient = createClient(BASE_URL, SUPABASE_KEY);

export default function ChatPage() {
  // Sua lógica vai aqui
  const [mensagem, setMensagem] = useState("");
  const [listaDeMensagem, setListaDeMensagem] = useState([]);

  useEffect(() => {
    supabaseClient
      .from("mensagens")
      .select("*")
      .order('id', {ascending: false})
      .then(({ data }) => {
        setListaDeMensagem(data);
      });
  }, []);

  const handleNovaMensagem = (novaMensagem) => {
    if (novaMensagem.trim() === "") return null;

    const mensagemCompleta = {
      //id: listaDeMensagem.length + 1,
      de: "GustavoCarv",
      texto: novaMensagem,
    };

    supabaseClient
      .from("mensagens")
      .insert(mensagemCompleta) // tem que ser um insert com os mesmos campos do banco
      .then(({ data }) => {
        setListaDeMensagem([data[0], ...listaDeMensagem]);
      });
  };

  const handleApagarMensagem = (id) => {
    setListaDeMensagem(
      listaDeMensagem.filter((mensagem) => {
        return mensagem.id !== id;
      })
    );
  };

  // ./Sua lógica vai aqui
  return (
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        backgroundImage: `url(https://images2.alphacoders.com/116/1165946.jpg)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
        color: appConfig.theme.colors.neutrals["000"],
      }}
    >
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: "100%",
          maxWidth: "95%",
          maxHeight: "95vh",
          padding: "32px",
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            height: "80%",
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: "column",
            borderRadius: "5px",
            padding: "16px",
          }}
        >
          <MessageList
            mensagens={listaDeMensagem}
            handleApagarMensagem={handleApagarMensagem}
          />

          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              value={mensagem}
              onChange={(e) => {
                setMensagem(e.target.value);
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleNovaMensagem(mensagem);
                  setMensagem("");
                }
              }}
              styleSheet={{
                width: "100%",
                border: "0",
                resize: "none",
                borderRadius: "5px",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: "12px",
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Logout"
          href="/"
        />
      </Box>
    </>
  );
}

function MessageList(props) {
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: "scroll",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
      }}
    >
      {props.mensagens.map((mensagem) => {
        return (
          <Text
            key={mensagem.id}
            tag="li"
            styleSheet={{
              borderRadius: "5px",
              position: "relative",
              padding: "6px",
              marginBottom: "12px",
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              },
            }}
          >
            <Box
              styleSheet={{
                marginBottom: "8px",
              }}
            >
              <Image
                styleSheet={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  display: "inline-block",
                  marginRight: "8px",
                }}
                src={`https://github.com/vanessametonini.png`}
              />
              <Text tag="strong">{mensagem.de}</Text>
              <Text
                styleSheet={{
                  fontSize: "10px",
                  marginLeft: "8px",
                  color: appConfig.theme.colors.neutrals[300],
                }}
                tag="span"
              >
                {new Date().toLocaleDateString()}
              </Text>
            </Box>
            {mensagem.texto}
            <Button
              iconName="FaTrash"
              onClick={(id) => {
                props.handleApagarMensagem(mensagem.id);
              }}
              styleSheet={{
                position: "absolute",
                right: "5px",
                top: "0",
                color: appConfig.theme.colors.neutrals[300],
                backgroundColor: appConfig.theme.colors.neutrals[700],
              }}
            />
          </Text>
        );
      })}
    </Box>
  );
}
