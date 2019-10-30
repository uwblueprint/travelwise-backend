CREATE TABLE public.answers (
    id integer NOT NULL,
    company_id integer,
    question_id integer,
    option_id integer
);
CREATE SEQUENCE public.answers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.answers_id_seq OWNED BY public.answers.id;
CREATE TABLE public.categories (
    id integer NOT NULL,
    scorecard_id integer NOT NULL,
    name character varying NOT NULL
);
CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;
CREATE TABLE public.companies (
    id integer NOT NULL,
    name character varying NOT NULL
);
CREATE SEQUENCE public.companies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.companies_id_seq OWNED BY public.companies.id;
CREATE SEQUENCE public.files_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE public.files (
    id integer DEFAULT nextval('public.files_id_seq'::regclass) NOT NULL,
    company_id integer NOT NULL,
    title character varying NOT NULL,
    location character varying NOT NULL
);
CREATE TABLE public.options (
    id integer NOT NULL,
    question_id integer,
    name character varying,
    score integer,
    CONSTRAINT options_score_check CHECK ((score > 0))
);
CREATE SEQUENCE public.options_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.options_id_seq OWNED BY public.options.id;
CREATE TABLE public.questions (
    id integer NOT NULL,
    name character varying,
    category_id integer NOT NULL
);
CREATE SEQUENCE public.questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.questions_id_seq OWNED BY public.questions.id;
CREATE TABLE public.scorecards (
    id integer NOT NULL,
    name character varying NOT NULL,
    description character varying
);
CREATE SEQUENCE public.scorecards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.scorecards_id_seq OWNED BY public.scorecards.id;
CREATE TABLE public.users (
    id integer NOT NULL,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    email character varying,
    champion boolean NOT NULL,
    company_id integer NOT NULL
);
CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
ALTER TABLE ONLY public.answers ALTER COLUMN id SET DEFAULT nextval('public.answers_id_seq'::regclass);
ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);
ALTER TABLE ONLY public.companies ALTER COLUMN id SET DEFAULT nextval('public.companies_id_seq'::regclass);
ALTER TABLE ONLY public.options ALTER COLUMN id SET DEFAULT nextval('public.options_id_seq'::regclass);
ALTER TABLE ONLY public.questions ALTER COLUMN id SET DEFAULT nextval('public.questions_id_seq'::regclass);
ALTER TABLE ONLY public.scorecards ALTER COLUMN id SET DEFAULT nextval('public.scorecards_id_seq'::regclass);
ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
ALTER TABLE ONLY public.answers
    ADD CONSTRAINT answers_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_name_key UNIQUE (name);
ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_location_key UNIQUE (location);
ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.options
    ADD CONSTRAINT options_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.scorecards
    ADD CONSTRAINT scorecards_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.answers
    ADD CONSTRAINT answers_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);
ALTER TABLE ONLY public.answers
    ADD CONSTRAINT answers_option_id_fkey FOREIGN KEY (option_id) REFERENCES public.options(id);
ALTER TABLE ONLY public.answers
    ADD CONSTRAINT answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id);
ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_scorecard_id_fkey FOREIGN KEY (scorecard_id) REFERENCES public.scorecards(id);
ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.options
    ADD CONSTRAINT options_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id);
ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);
