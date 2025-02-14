CREATE OR REPLACE FUNCTION enforce_non_negative_mmr()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.mmr < 0 THEN
    NEW.mmr := 0;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS mmr_non_negative_trigger ON "BingoProfile";

CREATE TRIGGER mmr_non_negative_trigger
BEFORE INSERT OR UPDATE ON "BingoProfile"
FOR EACH ROW
EXECUTE FUNCTION enforce_non_negative_mmr();