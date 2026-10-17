# Wireframes de baixa fidelidade

> Esboços estruturais (sem identidade visual). Servem para alinhar layout e
> navegação antes da implementação funcional.

## Login

```
+----------------------------------+
|        NPCP Academy              |
|                                  |
|   [ E-mail ________________ ]    |
|   [ Senha ________________ ]     |
|   [ Entrar ]                    |
|   (erro genérico, se houver)    |
+----------------------------------+
```

## Aceitar convite (não autenticado)

```
+----------------------------------+
|        Aceitar convite           |
|   E-mail convidado: x@x (RO)    |
|   [ Nome de exibição (opc) ]    |
|   [ Senha _______________ ]      |
|   [ Criar conta ]               |
+----------------------------------+
```

## Aceitar convite (sucesso — aguardar e-mail)

```
+----------------------------------+
|   Confirme seu e-mail            |
|   Enviamos um link para x@x.     |
+----------------------------------+
```

## Dashboard (após ativação)

```
+------------------------------------------------+
| NPCP Academy          [Nome] [Sair]            |
+------------------------------------------------+
| Dashboard                                       |
| Bem-vindo, Nome.  Papel: Membro                |
| (futuro: trilhas, progresso, competências)      |
+------------------------------------------------+
```

## Administração de convites (manager)

```
+------------------------------------------------+
| NPCP Academy          [Nome] [Sair]            |
+------------------------------------------------+
| Convites                                        |
| [ e-mail ] [ papel v ] [ Criar convite ]        |
|  + link copiável (após criar)                   |
|  - x@x · Membro · aguardando   [Revogar]        |
|  - y@y · Revisor · utilizado                    |
+------------------------------------------------+
```
