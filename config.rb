activate :relative_assets

activate :fjords do |config|
  config.username = Bundler.settings["fjords_username"]
  config.password = Bundler.settings["fjords_password"]
  config.domain = "directory.middlemanapp.com"
  config.gzip_assets = true
  config.cdn = true
end

def slugify(s)
  s.downcase.gsub(/'/, '').gsub(/[^a-z0-9]+/, '-')
end

# Generate v4 endpoints
ignore "/api/result.json"
data.templates.each do |t|
  proxy "/api/#{slugify(t.name)}.json", "/api/result.json", locals: { t: t }
end

activate :ember

configure :build do
  set :ember_variant, :production
  
  activate :minify_css
  activate :minify_javascript
end
