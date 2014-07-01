package etsc.quote.pdf;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONException;
import org.json.JSONObject;

import etsc.util.DictionaryDao;
import etsc.util.UtilDate;

public class AnalysisTermJson {
    public static void main(String[] args) throws Exception {
        String term = "{'city_of_term':'\u6b66\u6c49','price_type_of_term':5,'test':1,'test1':1,'pay_time1':2,'pay_way1':2,'pay_count1_currency_id':2,'pay_count1_amount':'9','pay_count2_amount':'0','pay_count3_amount':'0','pay_count4_amount':'0','pay_count5_amount':'0','is_include_tax':'on','receipt':1,'is_delivery':'on','deliver_time_from':'2','deliver_time_to':'4','is_warranty':'on','extra_warranty':'','has_warranty_priority':'on','need_disassemble':'on','need_on-site':'on','pay_count7_currency_id':1,'pay_count7_amount':'100','is_special_discount':'on','valid_time':'2013-01-01','extra_term':''}";

        JSONObject termJson = new JSONObject(
                "{'city_of_term':'\u6b66\u6c49','price_type_of_term':5,'test':1,'test1':1,'pay_time1':2,'pay_way1':2,'pay_count1_currency_id':2,'pay_count1_amount':'9','pay_count2_amount':'0','pay_count3_amount':'0','pay_count4_amount':'0','pay_count5_amount':'0','is_include_tax':'on','receipt':1,'is_delivery':'on','deliver_time_from':'2','deliver_time_to':'4','is_warranty':'on','extra_warranty':'','has_warranty_priority':'on','need_disassemble':'on','need_on-site':'on','pay_count7_currency_id':1,'pay_count7_amount':'100','is_special_discount':'on','valid_time':'2013-01-01','extra_term':''}");
        AnalysisTermJson analysisTermJson = new AnalysisTermJson(termJson);
        List<String> list = analysisTermJson.getTermList();
        for (String s : list) {
            System.out.println(s);
        }
        System.out.println();
    }

    JSONObject json;

    public AnalysisTermJson(JSONObject json) {

        this.json = json;

    };

    public String getValue(String key) {
        try {
            return json.getString(key);
        } catch (JSONException e) {

            // e.printStackTrace();
            return "";
        }
    }

    private boolean hasValue(String key) {
        try {
            json.getString(key);
            return true;
        } catch (JSONException e) {

            // e.printStackTrace();
            return false;
        }
    }

    public List<String> getTermList() {
        ArrayList<String> termList = new ArrayList<String>();
        // 1. 价格条款：武汉到货价。此价格不含税，如需开具发票，需收取相应发票税。/以上价格已含普通发票税（增值税）
        StringBuffer s_1 = new StringBuffer();
        // term1 = price_type_array_en[term["price_type_of_term"].to_i - 1].to_s
        // + " " + city_en_name + "."
        s_1.append("Term of Price: ").append(
                DictionaryDao.getDisplay("price_type_of_term_en",
                        getValue("price_type_of_term"))).append(
                " " + getValue("city_of_term")).append(".");
        /* 以下是中文版的，已调好 */
        // s_1.append("价格条款：").append(getValue("city_of_term")).append(
        // DictionaryDao.getDisplay("price_type_of_term",
        // getValue("price_type_of_term"))
        // + "。");
        // if (getValue("is_include_tax") != null) {
        // s_1.append("以上价格").append(
        // DictionaryDao.getDisplay("receipt", getValue("receipt"))
        // + "。");
        // }
        termList.add(s_1.toString());
        //
        // 2.
        // 付款方式：签订合同后15天内电汇预付30％款项，发货前15天内电汇支付30％款项，发货后15天内电汇支付30％款项，验收后15天内电汇支付10％款项
        // # （60%款项交货付现）
        // # （签订合同后开立100%即期不可撤销信用证，其中90%见单即付，10%验收合格后凭验收报告议付。）
        // # （签订合同后开立金额为USD3000的即期不可撤销信用证，其中90%见单即付，10%验收合格后凭验收报告议付。）
        // # （签订合同后开立90%的即期不可撤销信用证，100%见单即付。验收后15天内电汇10％款项。）
        // # （签订合同后开立90%的即期不可撤销信用证，100%见单即付。发货后30天内电汇10％款项。）
        // # （签订合同后开立90%的即期不可撤销信用证，其中90%见单即付，10%验收合格后凭验收报告议付。验收后6个月内电汇10％款项。）
        StringBuffer s_2 = new StringBuffer().append("Terms of Payment: ");
        if (!getValue("pay_way1").equals("")
                && !getValue("pay_count1_currency_id").equals("")
                && !getValue("pay_count1_amount").equals("0")
                && !getValue("pay_count1_amount").equals("")) {
            if (getValue("pay_way1").equals("2")) {
                // 电汇
                StringBuffer s_2_a = new StringBuffer();
                if (getValue("pay_count1_currency_id").equals("2")) {
                    s_2_a.append(getValue("pay_count1_amount")).append("%");
                } else {
                    s_2_a
                            .append(
                                    DictionaryDao
                                            .getcurrencies(getValue("pay_count1_currency_id")))
                            .append(getValue("pay_count1_amount"));
                }
                s_2.append(s_2_a).append(" T/T in advance within ")
                        .append(
                                DictionaryDao.getDisplay("pay_time",
                                        getValue("pay_time1"))).append(
                                " days after signing the contract.");
            } else {
                // 信用证
                StringBuffer s_2_a = new StringBuffer();
                if (getValue("pay_count1_currency_id").equals("2")) {
                    s_2_a.append(getValue("pay_count1_amount")).append(
                            "% irrevocable L/C at sight ");
                } else {
                    s_2_a
                            .append("An irrevocable L/C at sight amount ")
                            .append(
                                    DictionaryDao
                                            .getcurrencies(getValue("pay_count1_currency_id")))
                            .append(getValue("pay_count1_amount")).append(" ");
                }
                s_2.append(s_2_a).append("after signing the contract, ");
                if (getValue("cad_count_amount").equals("100")
                        && getValue("cad_count_currency_id").equals("2")) {
                    // 如果前面一个是100%，就没有“其余部分”了
                    s_2.append(" should be paid against the shipping documents. ");
                } else {
                    StringBuffer s_2_b = new StringBuffer();
                    if (getValue("cad_count_currency_id").equals("2")) {
                        s_2_b.append(getValue("cad_count_amount")).append("%");
                    } else {
                        s_2_b
                                .append(
                                        DictionaryDao
                                                .getcurrencies(getValue("cad_count_currency_id")))
                                .append(getValue("cad_count_amount"));
                    }
                    s_2
                            .append(s_2_b)
                            .append(
                                    " of the L/C value should be paid against the shipping documents, ");
                    StringBuffer s_2_c = new StringBuffer();
                    if (getValue("cad_left_count_currency_id").equals("2")) {
                        s_2_c.append(getValue("cad_left_count_amount")).append("%");
                    } else {
                        s_2_c
                                .append(
                                        DictionaryDao
                                                .getcurrencies(getValue("cad_left_count_currency_id")))
                                .append(getValue("cad_left_count_amount"));
                    }
                    s_2.append(s_2_b).append(
                            " of the L/C value should be paid against ").append(
                            DictionaryDao.getDisplay("cad_left_via_en",
                                    getValue("cad_left_via"))).append(". ");
                }
            }
        }
        if (!getValue("pay_time2").equals("")
                && !getValue("pay_count2_currency_id").equals("")
                && !getValue("pay_count2_amount").equals("0")
                && !getValue("pay_count2_amount").equals("")) {
            StringBuffer s_2_a = new StringBuffer();
            if (getValue("pay_count2_currency_id").equals("2")) {
                s_2_a.append(getValue("pay_count2_amount")).append("%");
            } else {
                s_2_a
                        .append(
                                DictionaryDao
                                        .getcurrencies(getValue("pay_count2_currency_id")))
                        .append(getValue("pay_count2_amount"));
            }
            s_2.append(s_2_a).append(" T/T within ")
                    .append(
                            DictionaryDao.getDisplay("pay_time",
                                    getValue("pay_time2"))).append(
                            " days before delivery. ");
        }
        if (!getValue("pay_time3").equals("")
                && !getValue("pay_count3_currency_id").equals("")
                && !getValue("pay_count3_amount").equals("0")
                && !getValue("pay_count3_amount").equals("")) {
            StringBuffer s_2_a = new StringBuffer();
            if (getValue("pay_count3_currency_id").equals("2")) {
                s_2_a.append(getValue("pay_count3_amount")).append("%");
            } else {
                s_2_a
                        .append(
                                DictionaryDao
                                        .getcurrencies(getValue("pay_count3_currency_id")))
                        .append(getValue("pay_count3_amount"));
            }
            s_2.append(s_2_a).append(" T/T within ")
                    .append(
                            DictionaryDao.getDisplay("pay_time",
                                    getValue("pay_time3"))).append(
                            " days after delivery. ");
        }
        if (!getValue("pay_time4").equals("")
                && !getValue("pay_count4_currency_id").equals("")
                && !getValue("pay_count4_amount").equals("0")
                && !getValue("pay_count4_amount").equals("")) {
            StringBuffer s_2_a = new StringBuffer();
            if (getValue("pay_count4_currency_id").equals("2")) {
                s_2_a.append(getValue("pay_count4_amount")).append("%");
            } else {
                s_2_a
                        .append(
                                DictionaryDao
                                        .getcurrencies(getValue("pay_count4_currency_id")))
                        .append(getValue("pay_count4_amount"));
            }
            s_2.append(s_2_a).append(" T/T within ")
                    .append(
                            DictionaryDao.getDisplay("pay_time",
                                    getValue("pay_time4"))).append(
                            " days after getting the acceptance at customer site. ");
        }
        if (!getValue("pay_count5_currency_id").equals("")
                && !getValue("pay_count5_amount").equals("0")
                && !getValue("pay_count5_amount").equals("")) {
            StringBuffer s_2_a = new StringBuffer();
            if (getValue("pay_count5_currency_id").equals("2")) {
                s_2_a.append(getValue("pay_count5_amount")).append("%");
            } else {
                s_2_a
                        .append(
                                DictionaryDao
                                        .getcurrencies(getValue("pay_count5_currency_id")))
                        .append(getValue("pay_count5_amount"));
            }
            s_2.append(s_2_a).append(" COD. ");
        }
        if(!getValue("pay_count6_currency_id").equals("") && !getValue("pay_count6_amount").equals("0") && !getValue("pay_count6_amount").equals("")) {
            StringBuffer s_2_a = new StringBuffer();
            if (getValue("pay_count6_currency_id").equals("2")) {
                s_2_a.append(getValue("pay_count6_amount")).append("%");
            } else {
                s_2_a
                        .append(
                                DictionaryDao
                                        .getcurrencies(getValue("pay_count6_currency_id")))
                        .append(getValue("pay_count6_amount"));
            }
            s_2.append("If the payment term is LC, ").append(s_2_a).append(" should be charged. ");
        }
        /* 以下是中文版的，已调好 */
        // if(getValue("pay_way1").equals("2")) {
        // //电汇
        // StringBuffer s_2_a = new StringBuffer();
        // if(getValue("pay_count1_currency_id").equals("2")) {
        // s_2_a.append(getValue("pay_count1_amount")).append("%款项");
        // } else {
        // s_2_a.append(DictionaryDao.getcurrencies(getValue("pay_count1_currency_id"))).append(getValue("pay_count1_amount"));
        // }
        // s_2.append("签订合同后").append(DictionaryDao.getDisplay("pay_time",
        // getValue("pay_time1"))).append("天内电汇预付").append(s_2_a);
        // } else {
        // //信用证
        // StringBuffer s_2_a = new StringBuffer();
        // if(getValue("pay_count1_currency_id").equals("2")) {
        // s_2_a.append(getValue("pay_count1_amount")).append("%");
        // } else {
        // s_2_a.append("金额为").append(DictionaryDao.getcurrencies(getValue("pay_count1_currency_id"))).append(getValue("pay_count1_amount")).append("的");
        // }
        // s_2.append("签订报价后开立").append(s_2_a).append("即期不可撤销信用证，");
        // if(getValue("cad_count_amount").equals("100") &&
        // getValue("cad_count_currency_id").equals("2")) {
        // //如果前面一个是100%，就没有“其余部分”了
        // s_2.append("100%见单即付");
        // } else {
        // StringBuffer s_2_b = new StringBuffer();
        // if(getValue("cad_count_currency_id").equals("2")) {
        // s_2_b.append(getValue("cad_count_amount")).append("%");
        // } else {
        // s_2_b.append(DictionaryDao.getcurrencies(getValue("cad_count_currency_id"))).append(getValue("cad_count_amount"));
        // }
        // s_2.append("其中").append(s_2_b).append("见单即付，");
        // StringBuffer s_2_c = new StringBuffer();
        // if(getValue("cad_left_count_currency_id").equals("2")) {
        // s_2_c.append(getValue("cad_left_count_amount")).append("%");
        // } else {
        // s_2_c.append(DictionaryDao.getcurrencies(getValue("cad_left_count_currency_id"))).append(getValue("cad_left_count_amount"));
        // }
        // s_2.append("其余").append(s_2_b).append("凭").append(DictionaryDao.getDisplay("cad_left_via",
        // getValue("cad_left_via"))).append("议付");
        // }
        // }
        // if(!getValue("pay_time2").equals("") &&
        // !getValue("pay_count2_currency_id").equals("") &&
        // !getValue("pay_count2_amount").equals("0") &&
        // !getValue("pay_count2_amount").equals("")) {
        // StringBuffer s_2_a = new StringBuffer();
        // if(getValue("pay_count2_currency_id").equals("2")) {
        // s_2_a.append(getValue("pay_count2_amount")).append("%款项");
        // } else {
        // s_2_a.append(DictionaryDao.getcurrencies(getValue("pay_count2_currency_id"))).append(getValue("pay_count2_amount"));
        // }
        // s_2.append("，发货前").append(DictionaryDao.getDisplay("pay_time",
        // getValue("pay_time2"))).append("天内电汇付").append(s_2_a);
        // }
        // if(!getValue("pay_time3").equals("") &&
        // !getValue("pay_count3_currency_id").equals("") &&
        // !getValue("pay_count3_amount").equals("0") &&
        // !getValue("pay_count3_amount").equals("")) {
        // StringBuffer s_2_a = new StringBuffer();
        // if(getValue("pay_count3_currency_id").equals("2")) {
        // s_2_a.append(getValue("pay_count3_amount")).append("%款项");
        // } else {
        // s_2_a.append(DictionaryDao.getcurrencies(getValue("pay_count3_currency_id"))).append(getValue("pay_count3_amount"));
        // }
        // s_2.append("，发货后").append(DictionaryDao.getDisplay("pay_time",
        // getValue("pay_time3"))).append("天内电汇预付").append(s_2_a);
        // }
        // if(!getValue("pay_time4").equals("") &&
        // !getValue("pay_count4_currency_id").equals("") &&
        // !getValue("pay_count4_amount").equals("0") &&
        // !getValue("pay_count4_amount").equals("")) {
        // StringBuffer s_2_a = new StringBuffer();
        // if(getValue("pay_count4_currency_id").equals("2")) {
        // s_2_a.append(getValue("pay_count4_amount")).append("%款项");
        // } else {
        // s_2_a.append(DictionaryDao.getcurrencies(getValue("pay_count4_currency_id"))).append(getValue("pay_count4_amount"));
        // }
        // s_2.append("，验收后").append(DictionaryDao.getDisplay("pay_time",
        // getValue("pay_time4"))).append("天内电汇预付").append(s_2_a);
        // }
        // if(!getValue("pay_count5_currency_id").equals("") &&
        // !getValue("pay_count5_amount").equals("0") &&
        // !getValue("pay_count5_amount").equals("")) {
        // StringBuffer s_2_a = new StringBuffer();
        // if(getValue("pay_count5_currency_id").equals("2")) {
        // s_2_a.append(getValue("pay_count5_amount")).append("%");
        // } else {
        // s_2_a.append(DictionaryDao.getcurrencies(getValue("pay_count5_currency_id"))).append(getValue("pay_count5_amount"));
        // }
        // s_2.append("， ").append(s_2_a).append("货款交货付现");
        // }
        // s_2.append("。");
        termList.add(s_2.toString());

        // 3. 交货期：收到预付款后 / 签订合同后 / 收到信用证后 周内发货。春节假期不在其中
        if (getValue("is_delivery").equals("on")) {
            StringBuffer s_3 = new StringBuffer();
            s_3.append("Delivery if Schedule: ").append(
                    getValue("deliver_time_from")).append("~").append(
                    getValue("deliver_time_to")).append(" ").append(
                    DictionaryDao.getDisplay("deliver_time_unit_en",
                            getValue("deliver_time_unit"))).append(" ").append(
                    DictionaryDao.getDisplay("delivery_point_en",
                            getValue("delivery_point"))).append(". ");
            if (getValue("fes_xmas").equals("on")
                    || getValue("fes_newy").equals("on")
                    || getValue("fes_sprg").equals("on")) {
                s_3.append("The delivery time does not include the ");
                if (getValue("fes_xmas").equals("on")) {
                    s_3.append("Christmas holiday & ");
                }
                if (getValue("fes_newy").equals("on")) {
                    s_3.append("new year holiday & ");
                }
                if (getValue("fes_sprg").equals("on")) {
                    s_3.append("Spring Festival & ");
                }
                s_3 = new StringBuffer(s_3.toString().substring(0,
                        s_3.length() - 3));
                s_3.append(".");
            }
            // s_3.append("交货期：").append(
            // DictionaryDao.getDisplay("delivery_point",
            // getValue("delivery_point"))).append(
            // getValue("deliver_time_from")).append("至").append(
            // getValue("deliver_time_to")).append(
            // DictionaryDao.getDisplay("deliver_time_unit",
            // getValue("delivery_point"))).append("内发货。");
            // if(getValue("fes_xmas").equals("on") ||
            // getValue("fes_newy").equals("on") ||
            // getValue("fes_sprg").equals("on")) {
            // if (getValue("fes_xmas").equals("on")) {
            // s_3.append("圣诞、");
            // }
            // if (getValue("fes_newy").equals("on")) {
            // s_3.append("新年、");
            // }
            // if (getValue("fes_sprg").equals("on")) {
            // s_3.append("春节、");
            // }
            // s_3= new StringBuffer(s_3.toString().substring(0,
            // s_3.length()-1));
            // s_3.append("假期不在其中。");
            // }
            termList.add(s_3.toString());
        }

        // 4. 质量保证：我方承诺自货物发出之日起 / 货物到港之日起 / 验收合格之日起1年内质保。
        if (getValue("is_warranty").equals("on")
                || getValue("has_warranty_priority").equals("on")) {
            StringBuffer s_4 = new StringBuffer().append("Warranty: ");
            if (getValue("is_warranty").equals("on")) {
                s_4.append(
                        DictionaryDao.getDisplay("warranty_time",
                                getValue("warranty_time"))).append(" months ")
                        .append(
                                DictionaryDao.getDisplay("warranty_point_en",
                                        getValue("warranty_point")));
                if (!getValue("extra_warranty").equals("")) {
                    s_4.append(", ").append(getValue("extra_warranty"));
                } else {
                    s_4.append(".");
                }
            }
            if (getValue("has_warranty_priority").equals("on")) {
                s_4
                        .append(" 12 months after acceptance or 13 months after the date of shipment, whichever comes earlier.");
            }
            // StringBuffer s_4 = new StringBuffer().append("质量保证：");
            // if(getValue("is_warranty").equals("on")) {
            // s_4.append("我方承诺").append(
            // DictionaryDao.getDisplay("warranty_point",
            // getValue("warranty_point"))).append(
            // DictionaryDao.getDisplay("warranty_time",
            // getValue("warranty_time"))).append("个月内质保");
            // if (getValue("extra_warranty") != null) {
            // s_4.append("，").append(getValue("extra_warranty"));
            // } else {
            // s_4.append("。");
            // }
            // }
            // if (getValue("has_warranty_priority").equals("on")) {
            // s_4.append("自货物验收合格后12个月或发货后的13个月, 以先到日期为准。");
            // }
            termList.add(s_4.toString());
        }

        // 5. 开机检测费：确定故障原因后，若客户同意维修，则开机检测费可免；若客户决定不维修，则只需支付开机检测费。
        if (getValue("need_disassemble").equals("on")) {
            StringBuffer s_5 = new StringBuffer();
            s_5
                    .append("After the equipment(s) inspection, ETSC will inform customer. If customer agrees to repair the equipment(s), then ETSC will not charge the inspection cost, or the inspection cost should be charged.");
            // s_5.append("开机检测费：").append(
            // "确定故障原因后，若客户同意维修，则开机检测费可免；若客户决定不维修，则只需支付开机检测费。");
            termList.add(s_5.toString());
        }
        // 6. 上门服务费：若需上门服务，则需另外支付上门服务费USD500/次(含差旅费)。
        if (getValue("need_on-site").equals("on")) {
            StringBuffer s_6 = new StringBuffer();
            s_6
                    .append("If customer need on-site service, engineer on-site service cost should be charged as ")
                    .append(
                            DictionaryDao
                                    .getcurrencies(getValue("pay_count7_currency_id")))
                    .append(getValue("pay_count7_amount"))
                    .append(".");
            // s_6.append("上门服务费：若需上门服务，则需另外支付上门服务费").append(
            // DictionaryDao
            // .getcurrencies(getValue("pay_count7_currency_id")))
            // .append(getValue("pay_count7_amount")).append("/次(含差旅费)。");
            termList.add(s_6.toString());
        }
        // 7. 此价格为给 武汉光迅科技股份有限公司 的一次性特别折扣 / 此折扣有效期以工厂折扣结束时间为准
        if (getValue("is_special_discount").equals("on")) {
            StringBuffer s_7 = new StringBuffer();
            s_7.append(
                    "This is one-time special discount.");
            if (getValue("is_discount_limit").equals("on")) {
                s_7
                        .append(" This price is special promotion price, validates until the promotion period ending.");
            }
            // s_7.append("特别折扣：").append("此价格为一次性特别折扣。");
            // if (getValue("is_discount_limit").equals("on")) {
            // s_7.append("此折扣有效期以生产厂商折扣结束时间为准。");
            // }
            termList.add(s_7.toString());
        }
        // 8. 报价有效期：此报价有效期至2009年 月 日。**/
        StringBuffer s_8 = new StringBuffer();
        s_8.append("This quotation's validity expands until ").append(
                UtilDate.getEn_Date(getValue("valid_time"))).append(".");
        // s_8.append("报价有效期：此报价有效期至").append(
        // UtilDate.getCn_Date(getValue("valid_time"))).append("。");
        termList.add(s_8.toString());
        // 9. 其它条款
        if (!getValue("extra_term").equals("")) {
            StringBuffer s_9 = new StringBuffer();
            s_9.append("Other terms: ").append(getValue("extra_term"));
            // s_9.append("其它条款：").append(getValue("extra_term"));
            termList.add(s_9.toString());
        }
        ArrayList<String> return_term=new ArrayList<String>();
        for(int i=0;i<termList.size();i++){
            return_term.add(i+1+". "+termList.get(i));
//            System.out.println(return_term);
        }
//        System.out.println(return_term);
        return return_term;
    }

    public List<String> getTermList_cn() {
        ArrayList<String> termList = new ArrayList<String>();
        // 1. 价格条款：武汉到货价。此价格不含税，如需开具发票，需收取相应发票税。/以上价格已含普通发票税（增值税）
        StringBuffer s_1 = new StringBuffer();
        // term1 = price_type_array_en[term["price_type_of_term"].to_i - 1].to_s
        // + " " + city_en_name + "."

        /* 以下是中文版的，已调好 */
        s_1.append("价格条款：").append(getValue("city_of_term")).append(
                DictionaryDao.getDisplay("price_type_of_term",
                        getValue("price_type_of_term"))
                        + "。");
        if (!getValue("is_include_tax").equals("")) {
            s_1.append("以上价格").append(
                    DictionaryDao.getDisplay("receipt", getValue("receipt"))
                            + "。");
        }
        termList.add(s_1.toString());
        //
        // 2.
        // 付款方式：签订合同后15天内电汇预付30％款项，发货前15天内电汇支付30％款项，发货后15天内电汇支付30％款项，验收后15天内电汇支付10％款项
        // # （60%款项交货付现）
        // # （签订合同后开立100%即期不可撤销信用证，其中90%见单即付，10%验收合格后凭验收报告议付。）
        // # （签订合同后开立金额为USD3000的即期不可撤销信用证，其中90%见单即付，10%验收合格后凭验收报告议付。）
        // # （签订合同后开立90%的即期不可撤销信用证，100%见单即付。验收后15天内电汇10％款项。）
        // # （签订合同后开立90%的即期不可撤销信用证，100%见单即付。发货后30天内电汇10％款项。）
        // # （签订合同后开立90%的即期不可撤销信用证，其中90%见单即付，10%验收合格后凭验收报告议付。验收后6个月内电汇10％款项。）

        /* 以下是中文版的，已调好 */
        StringBuffer s_2 = new StringBuffer();
        s_2.append("付款方式：");
        if (!getValue("pay_way1").equals("")
                && !getValue("pay_count1_currency_id").equals("")
                && !getValue("pay_count1_amount").equals("0")
                && !getValue("pay_count1_amount").equals("")) {
            if (getValue("pay_way1").equals("2")) {
                // 电汇
                StringBuffer s_2_a = new StringBuffer();
                if (getValue("pay_count1_currency_id").equals("2")) {
                    s_2_a.append(getValue("pay_count1_amount")).append("%款项");
                } else {
                    s_2_a
                            .append(
                                    DictionaryDao
                                            .getcurrencies(getValue("pay_count1_currency_id")))
                            .append(getValue("pay_count1_amount"));
                }
                s_2.append("；签订合同后")
                        .append(
                                DictionaryDao.getDisplay("pay_time",
                                        getValue("pay_time1"))).append("天内电汇预付")
                        .append(s_2_a);
            } else {
                // 信用证
                StringBuffer s_2_a = new StringBuffer();
                if (getValue("pay_count1_currency_id").equals("2")) {
                    s_2_a.append(getValue("pay_count1_amount")).append("%");
                } else {
                    s_2_a
                            .append("金额为")
                            .append(
                                    DictionaryDao
                                            .getcurrencies(getValue("pay_count1_currency_id")))
                            .append(getValue("pay_count1_amount")).append("的");
                }
                s_2.append("；签订合同后开立").append(s_2_a).append("即期不可撤销信用证，");
                if (getValue("cad_count_amount").equals("100")
                        && getValue("cad_count_currency_id").equals("2")) {
                    // 如果前面一个是100%，就没有“其余部分”了
                    s_2.append("100%见单即付");
                } else {
                    StringBuffer s_2_b = new StringBuffer();
                    if (getValue("cad_count_currency_id").equals("2")) {
                        s_2_b.append(getValue("cad_count_amount")).append("%");
                    } else {
                        s_2_b
                                .append(
                                        DictionaryDao
                                                .getcurrencies(getValue("cad_count_currency_id")))
                                .append(getValue("cad_count_amount"));
                    }
                    s_2.append("其中").append(s_2_b).append("见单即付，");
                    StringBuffer s_2_c = new StringBuffer();
                    if (getValue("cad_left_count_currency_id").equals("2")) {
                        s_2_c.append(getValue("cad_left_count_amount")).append("%");
                    } else {
                        s_2_c
                                .append(
                                        DictionaryDao
                                                .getcurrencies(getValue("cad_left_count_currency_id")))
                                .append(getValue("cad_left_count_amount"));
                    }
                    s_2.append("其余").append(s_2_b).append("凭").append(
                            DictionaryDao.getDisplay("cad_left_via",
                                    getValue("cad_left_via"))).append("议付");
                }
            }
        }
        if (!getValue("pay_time2").equals("")
                && !getValue("pay_count2_currency_id").equals("")
                && !getValue("pay_count2_amount").equals("0")
                && !getValue("pay_count2_amount").equals("")) {
            StringBuffer s_2_a = new StringBuffer();
            if (getValue("pay_count2_currency_id").equals("2")) {
                s_2_a.append(getValue("pay_count2_amount")).append("%款项");
            } else {
                s_2_a
                        .append(
                                DictionaryDao
                                        .getcurrencies(getValue("pay_count2_currency_id")))
                        .append(getValue("pay_count2_amount"));
            }
            s_2.append("；发货前")
                    .append(
                            DictionaryDao.getDisplay("pay_time",
                                    getValue("pay_time2"))).append("天内电汇预付")
                    .append(s_2_a);
        }
        if (!getValue("pay_time3").equals("")
                && !getValue("pay_count3_currency_id").equals("")
                && !getValue("pay_count3_amount").equals("0")
                && !getValue("pay_count3_amount").equals("")) {
            StringBuffer s_2_a = new StringBuffer();
            if (getValue("pay_count3_currency_id").equals("2")) {
                s_2_a.append(getValue("pay_count3_amount")).append("%款项");
            } else {
                s_2_a
                        .append(
                                DictionaryDao
                                        .getcurrencies(getValue("pay_count3_currency_id")))
                        .append(getValue("pay_count3_amount"));
            }
            s_2.append("；发货后")
                    .append(
                            DictionaryDao.getDisplay("pay_time",
                                    getValue("pay_time3"))).append("天内电汇支付")
                    .append(s_2_a);
        }
        if (!getValue("pay_time4").equals("")
                && !getValue("pay_count4_currency_id").equals("")
                && !getValue("pay_count4_amount").equals("0")
                && !getValue("pay_count4_amount").equals("")) {
            StringBuffer s_2_a = new StringBuffer();
            if (getValue("pay_count4_currency_id").equals("2")) {
                s_2_a.append(getValue("pay_count4_amount")).append("%款项");
            } else {
                s_2_a
                        .append(
                                DictionaryDao
                                        .getcurrencies(getValue("pay_count4_currency_id")))
                        .append(getValue("pay_count4_amount"));
            }
            s_2.append("；验收后")
                    .append(
                            DictionaryDao.getDisplay("pay_time",
                                    getValue("pay_time4"))).append("天内电汇支付")
                    .append(s_2_a);
        }
        if (!getValue("pay_count5_currency_id").equals("")
                && !getValue("pay_count5_amount").equals("0")
                && !getValue("pay_count5_amount").equals("")) {
            StringBuffer s_2_a = new StringBuffer();
            if (getValue("pay_count5_currency_id").equals("2")) {
                s_2_a.append(getValue("pay_count5_amount")).append("%");
            } else {
                s_2_a
                        .append(
                                DictionaryDao
                                        .getcurrencies(getValue("pay_count5_currency_id")))
                        .append(getValue("pay_count5_amount"));
            }
            s_2.append("；").append(s_2_a).append("货款交货付现");
        }
        if(!getValue("pay_count6_currency_id").equals("") && !getValue("pay_count6_amount").equals("0") && !getValue("pay_count6_amount").equals("")) {
            StringBuffer s_2_a = new StringBuffer();
            if (getValue("pay_count6_currency_id").equals("2")) {
                s_2_a.append(getValue("pay_count6_amount")).append("%");
            } else {
                s_2_a
                        .append(
                                DictionaryDao
                                        .getcurrencies(getValue("pay_count6_currency_id")))
                        .append(getValue("pay_count6_amount"));
            }
            s_2.append("。若采用信用证支付方式，需增加").append(s_2_a).append("信用证费用");
        }
        s_2.append("。");
        StringBuffer s_2_0 = new StringBuffer(s_2.toString().substring(0, 5));
        StringBuffer s_2_1 = new StringBuffer(s_2.toString().substring(6));
        s_2 = s_2_0.append(s_2_1);

        termList.add(s_2.toString());

        // 3. 交货期：收到预付款后 / 签订合同后 / 收到信用证后 周内发货。春节假期不在其中
        if (getValue("is_delivery").equals("on")) {
            StringBuffer s_3 = new StringBuffer();

            s_3.append("交货期：").append(
                    DictionaryDao.getDisplay("delivery_point",
                            getValue("delivery_point"))).append(
                    getValue("deliver_time_from")).append("至").append(
                    getValue("deliver_time_to")).append(
                    DictionaryDao.getDisplay("deliver_time_unit",
                            getValue("deliver_time_unit"))).append("内发货。");
            if (getValue("fes_xmas").equals("on")
                    || getValue("fes_newy").equals("on")
                    || getValue("fes_sprg").equals("on")) {
                if (getValue("fes_xmas").equals("on")) {
                    s_3.append("圣诞、");
                }
                if (getValue("fes_newy").equals("on")) {
                    s_3.append("新年、");
                }
                if (getValue("fes_sprg").equals("on")) {
                    s_3.append("春节、");
                }
                s_3 = new StringBuffer(s_3.toString().substring(0,
                        s_3.length() - 1));
                s_3.append("假期不在其中。");
            }
            termList.add(s_3.toString());
        }

        // 4. 质量保证：我方承诺自货物发出之日起 / 货物到港之日起 / 验收合格之日起1年内质保。
        if (getValue("is_warranty").equals("on")
                || getValue("has_warranty_priority").equals("on")) {

            StringBuffer s_4 = new StringBuffer().append("质量保证：");
            if (getValue("is_warranty").equals("on")) {
                s_4.append("我方承诺").append(
                        DictionaryDao.getDisplay("warranty_point",
                                getValue("warranty_point"))).append(
                        DictionaryDao.getDisplay("warranty_time",
                                getValue("warranty_time"))).append("个月内质保");
                if (!getValue("extra_warranty").equals("")) {
                    s_4.append("，").append(getValue("extra_warranty"));
                } else {
                    s_4.append("。");
                }
            }
            if (getValue("has_warranty_priority").equals("on")) {
                s_4.append("自货物验收合格后12个月或发货后的13个月，以先到日期为准。");
            }
            termList.add(s_4.toString());
        }

        // 5. 开机检测费：确定故障原因后，若客户同意维修，则开机检测费可免；若客户决定不维修，则只需支付开机检测费。
        if (getValue("need_disassemble").equals("on")) {
            StringBuffer s_5 = new StringBuffer();
            s_5.append("开机检测费：").append(
                    "确定故障原因后，若客户同意维修，则开机检测费可免；若客户决定不维修，则只需支付开机检测费。");
            termList.add(s_5.toString());
        }
        // 6. 上门服务费：若需上门服务，则需另外支付上门服务费USD500/次(含差旅费)。
        if (getValue("need_on-site").equals("on")) {
            StringBuffer s_6 = new StringBuffer();
            s_6.append("上门服务费：若需上门服务，则需另外支付上门服务费").append(
                    DictionaryDao
                            .getcurrencies(getValue("pay_count7_currency_id")))
                    .append(getValue("pay_count7_amount")).append("/次。");
            termList.add(s_6.toString());
        }
        // 7. 此价格为给 武汉光迅科技股份有限公司 的一次性特别折扣 / 此折扣有效期以工厂折扣结束时间为准
        if (getValue("is_special_discount").equals("on")) {
            StringBuffer s_7 = new StringBuffer();

            s_7.append("特别折扣：").append("此价格为一次性特别折扣。");
            if (getValue("is_discount_limit").equals("on")) {
                s_7.append("此折扣有效期以生产厂商折扣结束时间为准。");
            }
            termList.add(s_7.toString());
        }
        // 8. 报价有效期：此报价有效期至2009年 月 日。**/
        StringBuffer s_8 = new StringBuffer();

        s_8.append("报价有效期：此报价有效期至").append(
                UtilDate.getCn_Date(getValue("valid_time"))).append("。");
        termList.add(s_8.toString());
        // 9. 其它条款
        if (!getValue("extra_term").equals("")) {
            StringBuffer s_9 = new StringBuffer();
            s_9.append("其它条款：").append(getValue("extra_term"));
            termList.add(s_9.toString());
        }
        ArrayList<String> return_term=new ArrayList<String>();
        for(int i=0;i<termList.size();i++){
            return_term.add(i+1+". "+termList.get(i));
        }

        return return_term;
    }
}