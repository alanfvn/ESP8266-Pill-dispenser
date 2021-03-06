PGDMP     )                    z            dbgvvrcq23ms0q #   14.2 (Ubuntu 14.2-1.pgdg20.04+1+b1)    14.2 )               0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    15934420    dbgvvrcq23ms0q    DATABASE     c   CREATE DATABASE dbgvvrcq23ms0q WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.UTF-8';
    DROP DATABASE dbgvvrcq23ms0q;
                dplbtsjttstybb    false                       0    0    DATABASE dbgvvrcq23ms0q    ACL     A   REVOKE CONNECT,TEMPORARY ON DATABASE dbgvvrcq23ms0q FROM PUBLIC;
                   dplbtsjttstybb    false    4377                       0    0    dbgvvrcq23ms0q    DATABASE PROPERTIES     7   ALTER DATABASE dbgvvrcq23ms0q SET "TimeZone" TO 'UTC';
                     dplbtsjttstybb    false                       0    0    SCHEMA public    ACL     ?   REVOKE ALL ON SCHEMA public FROM postgres;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO dplbtsjttstybb;
GRANT ALL ON SCHEMA public TO PUBLIC;
                   dplbtsjttstybb    false    6                       0    0    LANGUAGE plpgsql    ACL     1   GRANT ALL ON LANGUAGE plpgsql TO dplbtsjttstybb;
                   postgres    false    885                        3079    15937349    pgcrypto 	   EXTENSION     <   CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
    DROP EXTENSION pgcrypto;
                   false                       0    0    EXTENSION pgcrypto    COMMENT     <   COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';
                        false    2                       1255    15937795 9   create_alarm(text, text, time without time zone, integer) 	   PROCEDURE     6  CREATE PROCEDURE public.create_alarm(IN uname text, IN a_name text, IN a_time time without time zone, IN a_day integer, OUT response text)
    LANGUAGE plpgsql
    AS $$
declare
	uid int;
begin
	
	select user_id into uid from tb_users where username = uname;
	
	if uid is null then
		raise exception 'Usuario inexistente';
	end if; 
	
	insert into tb_alarms(user_id, alarm_name, alarm_time, alarm_day) values 
		(
			uid, a_name, a_time, a_day
		);
	
	select '00000' into response;
	
exception when others then
	select cast(SQLSTATE as text) into response;
end; $$;
 ?   DROP PROCEDURE public.create_alarm(IN uname text, IN a_name text, IN a_time time without time zone, IN a_day integer, OUT response text);
       public          dplbtsjttstybb    false                       1255    15937769 #   create_user(text, text, text, text) 	   PROCEDURE     ?  CREATE PROCEDURE public.create_user(IN nams text, IN surn text, IN usrname text, IN usrpass text, OUT res text)
    LANGUAGE plpgsql
    AS $$
declare
-- variable declaration
begin
	
	insert into tb_users(names, surnames, username, pass) values
	(
		nams, surn, usrname, crypt(usrpass, gen_salt('bf', 4))
	);

	select '00000' into res;

exception when others then
	select cast(SQLSTATE as text) into res;
end; $$;
 o   DROP PROCEDURE public.create_user(IN nams text, IN surn text, IN usrname text, IN usrpass text, OUT res text);
       public          dplbtsjttstybb    false            ?            1255    15937567    login(text, text)    FUNCTION       CREATE FUNCTION public.login(nuser text, puser text) RETURNS text
    LANGUAGE plpgsql
    AS $$

declare uname text;

begin
	select username into uname
	from tb_users where lower(username) = lower(nuser) 
    and pass = crypt(puser, pass);
	
	return uname;
end;
$$;
 4   DROP FUNCTION public.login(nuser text, puser text);
       public          dplbtsjttstybb    false                       1255    15955398    notify_alarm(integer) 	   PROCEDURE     ?   CREATE PROCEDURE public.notify_alarm(IN aid integer)
    LANGUAGE plpgsql
    AS $$
begin
	insert into tb_notify(alarm_id, notify_date)
	values (aid, now());
    commit;
end;$$;
 4   DROP PROCEDURE public.notify_alarm(IN aid integer);
       public          dplbtsjttstybb    false            ?            1259    15937448 	   tb_alarms    TABLE     ?   CREATE TABLE public.tb_alarms (
    id_alarm integer NOT NULL,
    user_id integer,
    alarm_name text,
    alarm_time time without time zone,
    alarm_day integer
);
    DROP TABLE public.tb_alarms;
       public         heap    dplbtsjttstybb    false            ?            1259    15955186 	   tb_notify    TABLE     n   CREATE TABLE public.tb_notify (
    id_notify integer NOT NULL,
    notify_date date,
    alarm_id integer
);
    DROP TABLE public.tb_notify;
       public         heap    dplbtsjttstybb    false            ?            1259    15937397    tb_users    TABLE     ?   CREATE TABLE public.tb_users (
    user_id integer NOT NULL,
    names text,
    surnames text,
    username text,
    pass text
);
    DROP TABLE public.tb_users;
       public         heap    dplbtsjttstybb    false            ?            1259    15955362    alarms_to_notify    VIEW     ?  CREATE VIEW public.alarms_to_notify AS
 SELECT tb_alarms.id_alarm,
    tb_alarms.alarm_name,
    tb_alarms.alarm_time,
    tb_alarms.alarm_day,
    tb_users.username
   FROM ((public.tb_alarms
     JOIN public.tb_users ON ((tb_users.user_id = tb_alarms.user_id)))
     FULL JOIN public.tb_notify ON ((tb_notify.alarm_id = tb_alarms.id_alarm)))
  WHERE ((EXTRACT(dow FROM (now() AT TIME ZONE 'America/Guatemala'::text)) = (tb_alarms.alarm_day)::numeric) AND (tb_notify.alarm_id IS NULL));
 #   DROP VIEW public.alarms_to_notify;
       public          dplbtsjttstybb    false    213    211    211    213    213    216    213    213            ?            1259    15937447    tb_alarms_id_alarm_seq    SEQUENCE     ?   CREATE SEQUENCE public.tb_alarms_id_alarm_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.tb_alarms_id_alarm_seq;
       public          dplbtsjttstybb    false    213                       0    0    tb_alarms_id_alarm_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.tb_alarms_id_alarm_seq OWNED BY public.tb_alarms.id_alarm;
          public          dplbtsjttstybb    false    212            ?            1259    15955185    tb_notify_id_notify_seq    SEQUENCE     ?   CREATE SEQUENCE public.tb_notify_id_notify_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.tb_notify_id_notify_seq;
       public          dplbtsjttstybb    false    216                        0    0    tb_notify_id_notify_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.tb_notify_id_notify_seq OWNED BY public.tb_notify.id_notify;
          public          dplbtsjttstybb    false    215            ?            1259    15937396    tb_users_user_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.tb_users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.tb_users_user_id_seq;
       public          dplbtsjttstybb    false    211            !           0    0    tb_users_user_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.tb_users_user_id_seq OWNED BY public.tb_users.user_id;
          public          dplbtsjttstybb    false    210            ?            1259    15954594    user_alarms    VIEW       CREATE VIEW public.user_alarms AS
 SELECT tb_users.username,
    tb_alarms.user_id,
    tb_alarms.id_alarm,
    tb_alarms.alarm_name,
    tb_alarms.alarm_time,
    tb_alarms.alarm_day
   FROM (public.tb_alarms
     JOIN public.tb_users ON ((tb_alarms.user_id = tb_users.user_id)));
    DROP VIEW public.user_alarms;
       public          dplbtsjttstybb    false    211    213    213    213    213    213    211            s           2604    16075126    tb_alarms id_alarm    DEFAULT     x   ALTER TABLE ONLY public.tb_alarms ALTER COLUMN id_alarm SET DEFAULT nextval('public.tb_alarms_id_alarm_seq'::regclass);
 A   ALTER TABLE public.tb_alarms ALTER COLUMN id_alarm DROP DEFAULT;
       public          dplbtsjttstybb    false    213    212    213            t           2604    16075127    tb_notify id_notify    DEFAULT     z   ALTER TABLE ONLY public.tb_notify ALTER COLUMN id_notify SET DEFAULT nextval('public.tb_notify_id_notify_seq'::regclass);
 B   ALTER TABLE public.tb_notify ALTER COLUMN id_notify DROP DEFAULT;
       public          dplbtsjttstybb    false    215    216    216            r           2604    16075128    tb_users user_id    DEFAULT     t   ALTER TABLE ONLY public.tb_users ALTER COLUMN user_id SET DEFAULT nextval('public.tb_users_user_id_seq'::regclass);
 ?   ALTER TABLE public.tb_users ALTER COLUMN user_id DROP DEFAULT;
       public          dplbtsjttstybb    false    210    211    211                      0    15937448 	   tb_alarms 
   TABLE DATA           Y   COPY public.tb_alarms (id_alarm, user_id, alarm_name, alarm_time, alarm_day) FROM stdin;
    public          dplbtsjttstybb    false    213   ?4                 0    15955186 	   tb_notify 
   TABLE DATA           E   COPY public.tb_notify (id_notify, notify_date, alarm_id) FROM stdin;
    public          dplbtsjttstybb    false    216   ?5                 0    15937397    tb_users 
   TABLE DATA           L   COPY public.tb_users (user_id, names, surnames, username, pass) FROM stdin;
    public          dplbtsjttstybb    false    211   ?5       "           0    0    tb_alarms_id_alarm_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.tb_alarms_id_alarm_seq', 42, true);
          public          dplbtsjttstybb    false    212            #           0    0    tb_notify_id_notify_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.tb_notify_id_notify_seq', 22, true);
          public          dplbtsjttstybb    false    215            $           0    0    tb_users_user_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.tb_users_user_id_seq', 15, true);
          public          dplbtsjttstybb    false    210            z           2606    15937455    tb_alarms tb_alarms_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.tb_alarms
    ADD CONSTRAINT tb_alarms_pkey PRIMARY KEY (id_alarm);
 B   ALTER TABLE ONLY public.tb_alarms DROP CONSTRAINT tb_alarms_pkey;
       public            dplbtsjttstybb    false    213            |           2606    15937457 4   tb_alarms tb_alarms_user_id_alarm_time_alarm_day_key 
   CONSTRAINT     ?   ALTER TABLE ONLY public.tb_alarms
    ADD CONSTRAINT tb_alarms_user_id_alarm_time_alarm_day_key UNIQUE (user_id, alarm_time, alarm_day);
 ^   ALTER TABLE ONLY public.tb_alarms DROP CONSTRAINT tb_alarms_user_id_alarm_time_alarm_day_key;
       public            dplbtsjttstybb    false    213    213    213            ~           2606    15955191    tb_notify tb_notify_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY public.tb_notify
    ADD CONSTRAINT tb_notify_pkey PRIMARY KEY (id_notify);
 B   ALTER TABLE ONLY public.tb_notify DROP CONSTRAINT tb_notify_pkey;
       public            dplbtsjttstybb    false    216            v           2606    15937404    tb_users tb_users_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.tb_users
    ADD CONSTRAINT tb_users_pkey PRIMARY KEY (user_id);
 @   ALTER TABLE ONLY public.tb_users DROP CONSTRAINT tb_users_pkey;
       public            dplbtsjttstybb    false    211            x           2606    15937411    tb_users usuario_unique 
   CONSTRAINT     V   ALTER TABLE ONLY public.tb_users
    ADD CONSTRAINT usuario_unique UNIQUE (username);
 A   ALTER TABLE ONLY public.tb_users DROP CONSTRAINT usuario_unique;
       public            dplbtsjttstybb    false    211            ?           2606    15960554    tb_notify fk_alarm_notify    FK CONSTRAINT     ?   ALTER TABLE ONLY public.tb_notify
    ADD CONSTRAINT fk_alarm_notify FOREIGN KEY (alarm_id) REFERENCES public.tb_alarms(id_alarm) ON DELETE CASCADE NOT VALID;
 C   ALTER TABLE ONLY public.tb_notify DROP CONSTRAINT fk_alarm_notify;
       public          dplbtsjttstybb    false    4218    216    213                       2606    15937458     tb_alarms tb_alarms_user_id_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.tb_alarms
    ADD CONSTRAINT tb_alarms_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.tb_users(user_id) ON DELETE CASCADE;
 J   ALTER TABLE ONLY public.tb_alarms DROP CONSTRAINT tb_alarms_user_id_fkey;
       public          dplbtsjttstybb    false    213    4214    211               ?   x?]??? ??sy
?`?@??,?t?d$8????Č????(???4??S
P豬W?sL?w??L,???@aIj??????|\|d@??ZE?????r?~?UT;???0C?pr?=?ʤO=??t?U7????l3쏿????}'13h?^'?|!2SQ/         I   x?U??? ???"߁???? ?D?w????R?h??z?>??An=?u	&?
???a8???KAH??p ??         ?   x?-?;?0 ???=syk?"ň???R(?UPz????&8}ß??KRs[??`55??eʸ???)?? /^Ty4Y?8?,?RFj?ȏ??K????Z?b??b???F??䶉?
<R?i	????[ U?????ta???[??:?9??q?:!???
;8M=???*? ? p>$     