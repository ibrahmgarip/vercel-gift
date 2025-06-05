-- Create a function to automatically update popularity scores and refresh the materialized view
-- This can be called periodically or triggered by events

CREATE OR REPLACE FUNCTION refresh_top_selling_data() RETURNS void AS $$
BEGIN
  -- Update click counts from gift_clicks table
  UPDATE gifts 
  SET click_count = (
    SELECT COUNT(*) 
    FROM gift_clicks 
    WHERE gift_clicks.gift_id = gifts.id
  );
  
  -- Update sales counts from gift_sales table
  UPDATE gifts 
  SET sales_count = (
    SELECT COUNT(*) 
    FROM gift_sales 
    WHERE gift_sales.gift_id = gifts.id
  );
  
  -- Update last sale date
  UPDATE gifts 
  SET last_sale_date = (
    SELECT MAX(sale_date) 
    FROM gift_sales 
    WHERE gift_sales.gift_id = gifts.id
  );
  
  -- Recalculate popularity scores
  UPDATE gifts 
  SET popularity_score = calculate_popularity_score(
    total_score, 
    sales_count, 
    click_count, 
    created_at
  );
  
  -- Refresh the materialized view
  REFRESH MATERIALIZED VIEW top_selling_by_category;
  
  RAISE NOTICE 'Top selling data refreshed successfully';
END;
$$ LANGUAGE plpgsql;

-- Create a trigger function to update popularity when votes change
CREATE OR REPLACE FUNCTION update_gift_popularity_on_vote() RETURNS trigger AS $$
BEGIN
  -- Update the gift's total score and popularity
  UPDATE gifts 
  SET popularity_score = calculate_popularity_score(
    total_score, 
    sales_count, 
    click_count, 
    created_at
  )
  WHERE id = COALESCE(NEW.gift_id, OLD.gift_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic updates
DROP TRIGGER IF EXISTS trigger_update_popularity_on_vote ON votes;
CREATE TRIGGER trigger_update_popularity_on_vote
  AFTER INSERT OR UPDATE OR DELETE ON votes
  FOR EACH ROW
  EXECUTE FUNCTION update_gift_popularity_on_vote();

-- Create a trigger for when new sales are recorded
CREATE OR REPLACE FUNCTION update_gift_on_sale() RETURNS trigger AS $$
BEGIN
  -- Update sales count and last sale date
  UPDATE gifts 
  SET 
    sales_count = sales_count + 1,
    last_sale_date = NEW.sale_date,
    popularity_score = calculate_popularity_score(
      total_score, 
      sales_count + 1, 
      click_count, 
      created_at
    )
  WHERE id = NEW.gift_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_gift_on_sale ON gift_sales;
CREATE TRIGGER trigger_update_gift_on_sale
  AFTER INSERT ON gift_sales
  FOR EACH ROW
  EXECUTE FUNCTION update_gift_on_sale();

-- Create a trigger for when new clicks are recorded
CREATE OR REPLACE FUNCTION update_gift_on_click() RETURNS trigger AS $$
BEGIN
  -- Update click count and popularity
  UPDATE gifts 
  SET 
    click_count = click_count + 1,
    popularity_score = calculate_popularity_score(
      total_score, 
      sales_count, 
      click_count + 1, 
      created_at
    )
  WHERE id = NEW.gift_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_gift_on_click ON gift_clicks;
CREATE TRIGGER trigger_update_gift_on_click
  AFTER INSERT ON gift_clicks
  FOR EACH ROW
  EXECUTE FUNCTION update_gift_on_click();

-- Schedule automatic refresh (this would typically be done via cron or a scheduler)
-- For now, we'll just call it manually
SELECT refresh_top_selling_data();
